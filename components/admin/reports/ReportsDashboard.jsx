"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Car,
  CalendarCheck,
  BadgeDollarSign,
  Users,
  Radio,
  Download,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatDateTime } from "@/lib/sales";
import {
  BOOKING_STATUS_LABELS,
  VEHICLE_STATUS_LABELS,
} from "@/lib/report-labels";
import { SALE_STATUS_LABELS } from "@/lib/sales";
import { downloadCsv } from "@/lib/csv";
import { Spinner, Notice, Pill, Btn } from "../ui";

const WINDOWS = [
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "90 jours" },
];

function KpiCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
          {label}
        </p>
        <Icon size={16} className="text-[#D4AF37]" />
      </div>
      <p className="font-display text-2xl md:text-3xl font-bold mt-3">{value}</p>
      {sub && <p className="text-[11px] text-white/40 mt-1">{sub}</p>}
    </div>
  );
}

function StatusBreakdown({ title, counts, labels }) {
  const entries = Object.entries(counts ?? {});
  const total = entries.reduce((s, [, c]) => s + Number(c), 0);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F] mb-4">
        {title}
      </h4>
      {total === 0 ? (
        <p className="text-sm text-white/40">Aucune donnée.</p>
      ) : (
        <div className="space-y-2.5">
          {entries.map(([key, count]) => {
            const pct = total ? Math.round((Number(count) / total) * 100) : 0;
            return (
              <div key={key}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-white/70">{labels[key] ?? key}</span>
                  <span className="text-white/50">
                    {count} · {pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E0BE6F] to-[#B68A2F]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Graphique en barres SVG léger, sans dépendance de charting
function RevenueChart({ series }) {
  const W = 860;
  const H = 280;
  const PAD = { top: 20, right: 8, bottom: 34, left: 56 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const max = Math.max(
    1,
    ...series.map((d) => Number(d.rental) + Number(d.sales))
  );
  const barSlot = innerW / Math.max(series.length, 1);
  const barWidth = Math.max(2, barSlot * 0.62);

  const ticks = 4;
  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const value = (max / ticks) * i;
    const y = PAD.top + innerH - (value / max) * innerH;
    return { value, y };
  });

  const labelEvery = Math.ceil(series.length / 8);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F] flex items-center gap-2">
          <BarChart3 size={14} />
          Revenus journaliers (location + vente)
        </h4>
        <div className="flex items-center gap-4 text-[11px] text-white/55">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D4AF37]" /> Location
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" /> Vente
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
        {gridLines.map((g) => (
          <g key={g.y}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={g.y}
              y2={g.y}
              stroke="rgba(255,255,255,0.07)"
            />
            <text
              x={PAD.left - 8}
              y={g.y + 4}
              textAnchor="end"
              fontSize="10"
              fill="rgba(255,255,255,0.4)"
            >
              {Math.round(g.value).toLocaleString("fr-FR")}
            </text>
          </g>
        ))}

        {series.map((d, i) => {
          const rental = Number(d.rental);
          const sales = Number(d.sales);
          const x = PAD.left + i * barSlot + (barSlot - barWidth) / 2;
          const hRental = (rental / max) * innerH;
          const hSales = (sales / max) * innerH;
          const yRental = PAD.top + innerH - hRental;
          const ySales = yRental - hSales;
          const dateLabel = new Date(d.day).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
          });
          return (
            <g key={d.day}>
              <title>
                {`${dateLabel} — Location : ${formatMoney(rental)} · Vente : ${formatMoney(sales)}`}
              </title>
              {rental > 0 && (
                <rect
                  x={x}
                  y={yRental}
                  width={barWidth}
                  height={hRental}
                  fill="#D4AF37"
                  rx={1}
                />
              )}
              {sales > 0 && (
                <rect
                  x={x}
                  y={ySales}
                  width={barWidth}
                  height={hSales}
                  fill="#38bdf8"
                  rx={1}
                />
              )}
              {i % labelEvery === 0 && (
                <text
                  x={x + barWidth / 2}
                  y={H - 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(255,255,255,0.4)"
                >
                  {dateLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ReportsDashboard() {
  const supabase = useRef(createClient()).current;
  const [kpis, setKpis] = useState(null);
  const [series, setSeries] = useState([]);
  const [utilization, setUtilization] = useState([]);
  const [windowDays, setWindowDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    const [kpiRes, seriesRes, utilRes] = await Promise.all([
      supabase.rpc("admin_dashboard_kpis"),
      supabase.rpc("admin_revenue_series", { p_days: windowDays }),
      supabase.rpc("admin_fleet_utilization", { p_days: windowDays }),
    ]);

    const firstError = kpiRes.error || seriesRes.error || utilRes.error;
    if (firstError) {
      setError(
        firstError.code === "42501"
          ? "Accès refusé : votre compte n'a pas les privilèges personnel."
          : firstError.message
      );
      setLoading(false);
      return;
    }

    setKpis(kpiRes.data);
    setSeries(seriesRes.data ?? []);
    setUtilization(utilRes.data ?? []);
    setLastUpdated(new Date());
    setLoading(false);
  }, [supabase, windowDays]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  // Actualisation automatique toutes les 60 s
  useEffect(() => {
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  const totals = useMemo(() => {
    return series.reduce(
      (acc, d) => {
        acc.rental += Number(d.rental);
        acc.sales += Number(d.sales);
        return acc;
      },
      { rental: 0, sales: 0 }
    );
  }, [series]);

  function exportUtilizationCsv() {
    downloadCsv(
      `velox-occupation-flotte-${windowDays}j.csv`,
      utilization,
      [
        { label: "Marque", key: "brand" },
        { label: "Modèle", key: "model" },
        { label: "Statut", key: "status", value: (r) => VEHICLE_STATUS_LABELS[r.status] ?? r.status },
        { label: "Réservations", key: "bookings_count" },
        { label: "Jours loués", key: "booked_days" },
        { label: "Taux occupation (%)", key: "occupancy_pct" },
        { label: "CA location", key: "rental_revenue" },
        { label: "Tracker", key: "tracker_linked", value: (r) => (r.tracker_linked ? "oui" : "non") },
      ]
    );
  }

  function exportRevenueCsv() {
    downloadCsv(`velox-revenus-${windowDays}j.csv`, series, [
      { label: "Date", key: "day" },
      { label: "Revenus location", key: "rental" },
      { label: "Revenus vente", key: "sales" },
    ]);
  }

  if (loading && !kpis) return <Spinner label="Chargement des rapports..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Tableau de bord</h2>
          {lastUpdated && (
            <p className="text-[11px] text-white/40 mt-1">
              Actualisé le {formatDateTime(lastUpdated.toISOString())} · rafraîchissement auto 60 s
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-white/10 p-1">
            {WINDOWS.map((w) => (
              <button
                key={w.days}
                onClick={() => setWindowDays(w.days)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  windowDays === w.days
                    ? "bg-gradient-to-br from-[#E0BE6F] to-[#B68A2F] text-black"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
          <Btn variant="ghost" onClick={load} loading={loading}>
            <RefreshCw size={14} />
          </Btn>
        </div>
      </div>

      {error && <Notice type="error">{error}</Notice>}

      {kpis && (
        <>
          {/* KPI principaux */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon={Car}
              label="Flotte"
              value={kpis.fleet.total}
              sub={`${kpis.fleet.published} publiés · ${kpis.fleet.trackers_linked} trackers`}
            />
            <KpiCard
              icon={CalendarCheck}
              label="Taux d'occupation (30 j)"
              value={`${kpis.bookings.occupancy_30d_pct}%`}
              sub={`${kpis.bookings.active} location(s) en cours`}
            />
            <KpiCard
              icon={BadgeDollarSign}
              label={`CA location (${windowDays} j)`}
              value={formatMoney(totals.rental)}
              sub={`${kpis.bookings.total} réservations au total`}
            />
            <KpiCard
              icon={BadgeDollarSign}
              label={`CA vente (${windowDays} j)`}
              value={formatMoney(totals.sales)}
              sub={`Pipeline : ${formatMoney(kpis.sales.pipeline_value)}`}
            />
            <KpiCard
              icon={BadgeDollarSign}
              label="CA location historique"
              value={formatMoney(kpis.bookings.rental_revenue_all_time)}
            />
            <KpiCard
              icon={BadgeDollarSign}
              label="CA vente historique"
              value={formatMoney(kpis.sales.revenue_all_time)}
              sub={`${kpis.sales.delivered} vente(s) livrée(s)`}
            />
            <KpiCard
              icon={Users}
              label="Prospects"
              value={kpis.leads.total}
              sub={`${kpis.leads.new} nouveau(x) · ${kpis.leads.converted} converti(s)`}
            />
            <KpiCard
              icon={Radio}
              label="Positions 24 h"
              value={kpis.tracking.positions_24h}
              sub="véhicules ayant transmis"
            />
          </div>

          {/* Répartition par statuts */}
          <div className="grid md:grid-cols-3 gap-4">
            <StatusBreakdown
              title="Statuts flotte"
              counts={kpis.fleet.by_status}
              labels={VEHICLE_STATUS_LABELS}
            />
            <StatusBreakdown
              title="Statuts réservations"
              counts={kpis.bookings.by_status}
              labels={BOOKING_STATUS_LABELS}
            />
            <StatusBreakdown
              title="Étapes de vente"
              counts={kpis.sales.by_status}
              labels={SALE_STATUS_LABELS}
            />
          </div>

          {/* Graphique revenus */}
          <RevenueChart series={series} />

          {/* Occupation de la flotte */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
                Occupation de la flotte ({windowDays} jours)
              </h4>
              <div className="flex gap-2">
                <Btn variant="ghost" className="!px-4 !py-2" onClick={exportRevenueCsv}>
                  <Download size={13} />
                  Revenus CSV
                </Btn>
                <Btn variant="ghost" className="!px-4 !py-2" onClick={exportUtilizationCsv}>
                  <Download size={13} />
                  Occupation CSV
                </Btn>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[820px]">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-white/45">
                    <th className="px-3 py-2 font-bold">Véhicule</th>
                    <th className="px-3 py-2 font-bold">Statut</th>
                    <th className="px-3 py-2 font-bold text-center">Réservations</th>
                    <th className="px-3 py-2 font-bold w-[220px]">Occupation</th>
                    <th className="px-3 py-2 font-bold text-right">CA location</th>
                    <th className="px-3 py-2 font-bold text-center">GPS</th>
                  </tr>
                </thead>
                <tbody>
                  {utilization.map((u) => (
                    <tr
                      key={u.vehicle_id}
                      className="border-t border-white/[0.07]"
                    >
                      <td className="px-3 py-3 font-semibold whitespace-nowrap">
                        {u.brand} {u.model}
                      </td>
                      <td className="px-3 py-3">
                        <Pill tone={u.status === "available" ? "green" : u.status === "maintenance" ? "red" : "gold"}>
                          {VEHICLE_STATUS_LABELS[u.status] ?? u.status}
                        </Pill>
                      </td>
                      <td className="px-3 py-3 text-center">{u.bookings_count}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-white/[0.07] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#E0BE6F] to-[#B68A2F]"
                              style={{ width: `${Math.min(100, Number(u.occupancy_pct))}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-white/55 w-12 text-right">
                            {u.occupancy_pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                        {formatMoney(u.rental_revenue)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {u.tracker_linked ? (
                          <Radio size={15} className="inline text-emerald-400" />
                        ) : (
                          <span className="text-white/30 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
