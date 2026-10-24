"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { Spinner, Notice } from "@/components/admin/ui";

// Leaflet ne s'exécute que côté navigateur
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center"
      style={{ height: 560 }}
    >
      <Spinner label="Chargement de la carte..." />
    </div>
  ),
});

// Les colonnes geography(Point) sont renvoyées en GeoJSON { coordinates:[lng,lat] }
function toPoint(row) {
  const coords = row.location?.coordinates;
  if (!Array.isArray(coords)) return null;
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    lat: coords[1],
    lng: coords[0],
    speed: row.speed,
    heading: row.heading,
    engine_status: row.engine_status,
    recorded_at: row.recorded_at,
    source: row.source,
    vehicle: row.vehicle,
  };
}

export default function LiveFleetMap({ height = 560, onPointsChange }) {
  const supabase = useRef(createClient()).current;
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [live, setLive] = useState(false);

  // Conserve uniquement la dernière position de chaque véhicule
  const upsertPoint = useCallback((point) => {
    setPoints((prev) => {
      const others = prev.filter((p) => p.vehicleId !== point.vehicleId);
      const next = [point, ...others];
      onPointsChange?.(next);
      return next;
    });
  }, [onPointsChange]);

  useEffect(() => {
    let channel;

    (async () => {
      // Chargement initial : dernières positions (RLS : publiques ou staff)
      const { data, error: fetchErr } = await supabase
        .from("vehicle_locations")
        .select(
          `id, vehicle_id, location, speed, heading, engine_status, recorded_at, source,
           vehicle:vehicles(id, slug, brand, model, status, is_published, business_line)`
        )
        .order("recorded_at", { ascending: false })
        .limit(300);

      if (fetchErr) {
        setError(fetchErr.message);
        setLoading(false);
        return;
      }

      const latest = new Map();
      for (const row of data ?? []) {
        if (latest.has(row.vehicle_id)) continue;
        const point = toPoint(row);
        if (point) latest.set(point.vehicleId, point);
      }
      const initial = [...latest.values()];
      setPoints(initial);
      onPointsChange?.(initial);
      setLoading(false);

      // Abonnement temps réel aux nouvelles positions
      channel = supabase
        .channel("vehicle-locations-live")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "vehicle_locations",
          },
          (payload) => {
            const point = toPoint(payload.new);
            if (point) upsertPoint(point);
          }
        )
        .subscribe((status) => setLive(status === "SUBSCRIBED"));
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase, upsertPoint, onPointsChange]);

  if (loading) {
    return (
      <div
        className="rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center"
        style={{ height }}
      >
        <Spinner label="Chargement des positions..." />
      </div>
    );
  }

  if (error) {
    return (
      <Notice type="error">
        Carte indisponible : {error}
      </Notice>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/45">
        <span
          className={`w-2 h-2 rounded-full ${live ? "bg-emerald-400 animate-pulse" : "bg-white/30"}`}
        />
        {live ? "Flux temps réel actif" : "Connexion au flux..."}
        <span className="text-white/30 normal-case tracking-normal">
          · {points.length} véhicule(s) suivi(s)
        </span>
      </div>
      <MapView points={points} height={height} />
    </div>
  );
}
