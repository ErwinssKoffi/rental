// Edge Function : réception des webhooks de positions Traccar.
// Authentification par secret partagé (en-tête x-traccar-secret), puis
// écriture en clé service_role (contourne la RLS, aucune insertion anonyme
// n'est permise par les politiques de la table vehicle_locations).
//
// Formats de payload acceptés :
//   1. Évènement Traccar : { device: { uniqueId }, position: { ... } }
//   2. Lot de positions   : { device: { uniqueId }, positions: [ ... ] }
//   3. Position aplatie   : { uniqueId, latitude, longitude, ... }
//   4. Tableau de l'une de ces trois formes

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface PositionPayload {
  latitude?: number;
  lat?: number;
  longitude?: number;
  lng?: number;
  lon?: number;
  speed?: number;
  course?: number;
  heading?: number;
  accuracy?: number;
  battery?: number;
  ignition?: boolean;
  deviceTime?: string;
  fixTime?: string;
  serverTime?: string;
  uniqueId?: string;
}

interface NormalizedMessage {
  uniqueId: string;
  positions: PositionPayload[];
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function extractUniqueId(device: unknown): string | null {
  if (!device || typeof device !== "object") return null;
  const d = device as Record<string, unknown>;
  return (d.uniqueId as string) ?? (d.unique_id as string) ?? null;
}

function normalize(body: unknown): NormalizedMessage[] {
  const items = Array.isArray(body) ? body : [body];
  const out: NormalizedMessage[] = [];

  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;

    // Cas 1 & 2 : device + position(s)
    const uniqueId = extractUniqueId(item.device);
    if (uniqueId) {
      const positions: PositionPayload[] = [];
      if (item.position) positions.push(item.position as PositionPayload);
      if (Array.isArray(item.positions)) {
        positions.push(...(item.positions as PositionPayload[]));
      }
      if (positions.length) out.push({ uniqueId, positions });
      continue;
    }

    // Cas 3 : position aplatie avec uniqueId
    const flatId =
      (item.uniqueId as string) ?? (item.unique_id as string) ?? null;
    if (flatId) out.push({ uniqueId: flatId, positions: [item as PositionPayload] });
  }

  return out;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const expectedSecret = Deno.env.get("TRACCAR_WEBHOOK_SECRET");
  const providedSecret = req.headers.get("x-traccar-secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const messages = normalize(body);
  if (messages.length === 0) {
    return json({ error: "unrecognized_payload" }, 422);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  // Cache device → vehicle sur la durée de l'invocation
  const vehicleCache = new Map<string, string | null>();
  const summary = {
    received: 0,
    inserted: 0,
    unmapped_devices: 0,
    errors: [] as string[],
  };

  for (const message of messages) {
    let vehicleId = vehicleCache.get(message.uniqueId) ?? null;
    if (!vehicleCache.has(message.uniqueId)) {
      const { data: vehicle } = await supabase
        .from("vehicles")
        .select("id")
        .eq("tracker_device_id", message.uniqueId)
        .maybeSingle();
      vehicleId = vehicle?.id ?? null;
      vehicleCache.set(message.uniqueId, vehicleId);
    }

    if (!vehicleId) {
      summary.unmapped_devices += message.positions.length;
      continue;
    }

    for (const p of message.positions) {
      summary.received++;
      const lat = p.latitude ?? p.lat;
      const lng = p.longitude ?? p.lng ?? p.lon;
      if (typeof lat !== "number" || typeof lng !== "number") {
        summary.errors.push("missing_coordinates");
        continue;
      }

      const wkt = `SRID=4326;POINT(${lng} ${lat})`;
      const { error: insertError } = await supabase
        .from("vehicle_locations")
        .insert({
          vehicle_id: vehicleId,
          location: wkt,
          speed: p.speed ?? null,
          heading: p.course ?? p.heading ?? null,
          accuracy: p.accuracy ?? null,
          engine_status:
            typeof p.ignition === "boolean"
              ? p.ignition
                ? "on"
                : "off"
              : null,
          battery: p.battery ?? null,
          recorded_at: p.deviceTime ?? p.fixTime ?? new Date().toISOString(),
          source: "traccar",
        });

      if (insertError) {
        summary.errors.push(insertError.message);
        continue;
      }

      // Miroir de la dernière position sur la fiche véhicule
      const { error: updateError } = await supabase
        .from("vehicles")
        .update({ last_location: wkt })
        .eq("id", vehicleId);
      if (updateError) summary.errors.push(updateError.message);

      summary.inserted++;
    }
  }

  return json(summary, summary.inserted > 0 ? 200 : 207);
});
