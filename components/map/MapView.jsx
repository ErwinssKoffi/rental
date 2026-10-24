"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatDate } from "@/lib/bookings";

// Marqueur doré personnalisé (évite les images d'icônes par défaut de Leaflet)
function makeIcon(status) {
  const state =
    status === "rented"
      ? "is-rented"
      : status === "maintenance"
        ? "is-maintenance"
        : "is-available";
  return L.divIcon({
    className: "velox-marker",
    html: `<span class="velox-pin ${state}"><span class="velox-pin-pulse"></span></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}

// Recentre automatiquement la carte sur l'ensemble des véhicules
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
  }, [map, points]);
  return null;
}

export default function MapView({ points = [], height = 560, center = [5.3204, -4.0197] }) {
  const markers = useMemo(
    () =>
      points
        .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
        .map((p) => ({ ...p, icon: makeIcon(p.vehicle?.status) })),
    [points]
  );

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        style={{ height, width: "100%", background: "#0a0a0a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={markers} />
        {markers.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={p.icon}>
            <Popup>
              <div className="min-w-[200px]">
                <p className="font-display font-bold text-sm text-black">
                  {p.vehicle
                    ? `${p.vehicle.brand} ${p.vehicle.model}`
                    : "Véhicule"}
                </p>
                <p className="text-[11px] text-gray-600 capitalize mt-0.5">
                  {p.vehicle?.status ?? "—"}
                  {p.engine_status ? ` · moteur ${p.engine_status === "on" ? "allumé" : "coupé"}` : ""}
                </p>
                <div className="text-[11px] text-gray-700 mt-2 space-y-0.5">
                  <p>
                    Vitesse :{" "}
                    <strong>{p.speed != null ? `${Math.round(p.speed)} km/h` : "—"}</strong>
                  </p>
                  <p>
                    Position reçue : <strong>{formatDate(p.recorded_at)}</strong>
                  </p>
                  <p className="text-gray-500">
                    {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                  </p>
                </div>
                {p.vehicle?.slug && (
                  <Link
                    href={`/cars/${p.vehicle.slug}`}
                    className="inline-block mt-2 text-[11px] font-bold uppercase tracking-widest text-[#B68A2F] hover:underline"
                  >
                    Voir la fiche
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
