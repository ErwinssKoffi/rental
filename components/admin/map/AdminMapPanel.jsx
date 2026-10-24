"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Navigation, Play, Radio, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LiveFleetMap from "@/components/map/LiveFleetMap";
import { Btn, Field, Notice, Select, TextInput } from "../ui";

const ABIDJAN = { lat: 5.3204, lng: -4.0197 };

// Marche aléatoire dans un rayon d'environ 2 km autour d'un point
function randomStep(lat, lng) {
  return {
    lat: lat + (Math.random() - 0.5) * 0.018,
    lng: lng + (Math.random() - 0.5) * 0.018,
  };
}

export default function AdminMapPanel() {
  const supabase = useRef(createClient()).current;
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [trackerId, setTrackerId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [points, setPoints] = useState([]);
  const tripTimers = useRef([]);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from("vehicles")
        .select("id, slug, brand, model, status, tracker_device_id")
        .order("brand", { ascending: true });
      if (err) setError(err.message);
      else {
        setVehicles(data ?? []);
        if (data?.length) {
          setSelectedId(data[0].id);
          setTrackerId(data[0].tracker_device_id ?? "");
        }
      }
    })();
    return () => tripTimers.current.forEach(clearTimeout);
  }, [supabase]);

  useEffect(() => {
    const v = vehicles.find((x) => x.id === selectedId);
    setTrackerId(v?.tracker_device_id ?? "");
  }, [selectedId, vehicles]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedId);

  // Dernier point connu depuis la carte (ou position agence par défaut)
  const lastCoordsOf = useCallback(
    (vehicleId) => {
      const p = points.find((x) => x.vehicleId === vehicleId);
      if (p) return { lat: p.lat, lng: p.lng };
      return ABIDJAN;
    },
    [points]
  );

  async function emitPosition(vehicleId, coords, extra = {}) {
    const wkt = `SRID=4326;POINT(${coords.lng} ${coords.lat})`;
    const { error: locErr } = await supabase.from("vehicle_locations").insert({
      vehicle_id: vehicleId,
      location: wkt,
      speed: extra.speed ?? Math.round(20 + Math.random() * 40),
      heading: extra.heading ?? Math.round(Math.random() * 359),
      engine_status: extra.engine_status ?? "on",
      recorded_at: new Date().toISOString(),
      source: "simulator",
    });
    if (locErr) throw locErr;

    const { error: vehErr } = await supabase
      .from("vehicles")
      .update({ last_location: wkt })
      .eq("id", vehicleId);
    if (vehErr) throw vehErr;
  }

  async function sendRandomPoint() {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    try {
      const base = lastCoordsOf(selectedId);
      await emitPosition(selectedId, randomStep(base.lat, base.lng));
      setInfo("Position envoyée — la carte se met à jour en direct.");
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  function simulateTrip() {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    let coords = lastCoordsOf(selectedId);

    for (let i = 0; i < 6; i++) {
      const t = setTimeout(async () => {
        try {
          coords = randomStep(coords.lat, coords.lng);
          await emitPosition(selectedId, coords, {
            speed: Math.round(35 + Math.random() * 55),
          });
          if (i === 5) {
            setBusy(false);
            setInfo("Trajet simulé : 6 positions transmises.");
          }
        } catch (e) {
          setError(e.message);
          setBusy(false);
        }
      }, i * 1300);
      tripTimers.current.push(t);
    }
  }

  async function saveTrackerId() {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    const value = trackerId.trim() || null;
    const { error: err } = await supabase
      .from("vehicles")
      .update({ tracker_device_id: value })
      .eq("id", selectedId);
    if (err) {
      setError(
        err.code === "23505"
          ? "Cet identifiant tracker est déjà lié à un autre véhicule."
          : err.message
      );
    } else {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === selectedId ? { ...v, tracker_device_id: value } : v
        )
      );
      setInfo("Identifiant tracker enregistré.");
    }
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      {error && <Notice type="error">{error}</Notice>}
      {info && <Notice type="success">{info}</Notice>}

      {/* Contrôles de simulation / liaison tracker */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F] flex items-center gap-2 mb-4">
          <Radio size={14} />
          Simulation & liaison des trackers
        </h3>
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <Field label="Véhicule">
            <Select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Identifiant tracker (uniqueId Traccar)"
            hint="Doit correspondre au device uniqueId de votre serveur Traccar"
          >
            <TextInput
              value={trackerId}
              onChange={(e) => setTrackerId(e.target.value)}
              placeholder="ex: velox-porsche-911-01"
            />
          </Field>
          <Btn variant="ghost" onClick={saveTrackerId} loading={busy}>
            <Save size={14} />
            Lier
          </Btn>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <Btn onClick={sendRandomPoint} loading={busy}>
            <Navigation size={14} />
            Envoyer une position
          </Btn>
          <Btn variant="ghost" onClick={simulateTrip} loading={busy}>
            <Play size={14} />
            Simuler un trajet (6 points)
          </Btn>
          {selectedVehicle && (
            <span className="self-center text-[11px] text-white/40">
              Les positions sont insérées en base (RLS personnel) et diffusées
              instantanément par Supabase Realtime.
            </span>
          )}
        </div>
      </div>

      <LiveFleetMap height={620} onPointsChange={setPoints} />
    </div>
  );
}
