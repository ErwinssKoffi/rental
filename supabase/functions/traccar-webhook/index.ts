// Edge Function : réception des webhooks de positions Traccar.
// Authentification par secret partagé (en-tête x-traccar-secret), puis
// écriture en clé service_role via l'API PostgREST (contourne la RLS,
// aucune insertion anonyme n'est permise par les politiques de
// vehicle_locations).
//
// Zéro dépendance externe : seules les API natives Deno sont utilisées
// (les modules distants ne sont pas bundlés lors d'un déploiement via l'API).
//
// Formats de payload acceptés :
//   1. Évènement Traccar : { device: { uniqueId }, position: { ... } }
//   2. Lot de positions   : { device: { uniqueId }, positions: [ ... ] }
//   3. Position aplatie   : { uniqueId, latitude, longitude, ... }
//   4. Tableau de l'une de ces trois formes

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
    if (flatId) {
      out.push({ uniqueId: flatId, positions: [item as PositionPayload] });
    }
  }

  return out;
}

const BASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const REST_HEADERS: Record<string, string> = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

// Résout tracker_device_id → vehicle_id via PostgREST.
async function resolveVehicle(uniqueId: string): Promise<string | null> {
  const url =
    `${BASE_URL}/rest/v1/vehicles?select=id&tracker_device_id=eq.` +
    encodeURIComponent(uniqueId);
  const res = await fetch(url, { headers: REST_HEADERS });
  if (!res.ok) return null;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length ? rows[0].id : null;
}

async function insertLocation(row: Record<string, unknown>): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/rest/v1/vehicle_locations`, {
    method: "POST",
    headers: { ...REST_HEADERS, Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  return res.ok ? null : `insert_${res.status}: ${await res.text()}`;
}

async function mirrorLastPosition(
  vehicleId: string,
  wkt: string
): Promise<string | null> {
  const res = await fetch(
    `${BASE_URL}/rest/v1/vehicles?id=eq.${encodeURIComponent(vehicleId)}`,
    {
      method: "PATCH",
      headers: { ...REST_HEADERS, Prefer: "return=minimal" },
      body: JSON.stringify({ last_location: wkt }),
    }
  );
  return res.ok ? null : `update_${res.status}: ${await res.text()}`;
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
      vehicleId = await resolveVehicle(message.uniqueId);
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
      const insertError = await insertLocation({
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
        summary.errors.push(insertError);
        continue;
      }

      // Miroir de la dernière position sur la fiche véhicule
      const updateError = await mirrorLastPosition(vehicleId, wkt);
      if (updateError) summary.errors.push(updateError);

      summary.inserted++;
    }
  }

  return json(summary, summary.inserted > 0 ? 200 : 207);
});
