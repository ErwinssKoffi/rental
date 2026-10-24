"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  SALE_STATUSES,
  SALE_STATUS_LABELS,
  SALE_STATUS_TONES,
  PAYMENT_LABELS,
  formatDateTime,
  formatMoney,
} from "@/lib/sales";
import { Pill, Spinner, Notice, TextInput } from "../ui";
import SaleDetailModal from "./SaleDetailModal";

export default function SalesManager() {
  const supabase = createClient();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("vehicle_sales")
      .select(
        `id, reference, status, payment_status, asking_price, agreed_price,
         deposit, created_at, sold_at,
         vehicle:vehicles(id, slug, brand, model),
         customer:profiles!vehicle_sales_customer_id_fkey(first_name, last_name, email)`
      )
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setSales(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const active = sales.filter((s) => s.status !== "cancelled");
    return {
      total: sales.length,
      open: active.filter((s) => !["delivered"].includes(s.status)).length,
      delivered: sales.filter((s) => s.status === "delivered").length,
      pipelineValue: active
        .filter((s) => !["delivered"].includes(s.status))
        .reduce((sum, s) => sum + Number(s.agreed_price ?? s.asking_price ?? 0), 0),
      revenue: sales
        .filter((s) => s.status === "delivered")
        .reduce((sum, s) => sum + Number(s.agreed_price ?? s.asking_price ?? 0), 0),
    };
  }, [sales]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sales.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!q) return true;
      return [
        s.reference,
        s.customer_name,
        s.customer_email,
        s.vehicle?.brand,
        s.vehicle?.model,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [sales, statusFilter, search]);

  if (loading) return <Spinner label="Chargement du pipeline de vente..." />;

  return (
    <div className="space-y-6">
      {error && <Notice type="error">{error}</Notice>}

      {/* Indicateurs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Dossiers", value: stats.total },
          { label: "En cours", value: stats.open },
          { label: "Livraisons", value: stats.delivered },
          { label: "CA réalisé", value: formatMoney(stats.revenue) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
              {s.label}
            </p>
            <p className="font-display text-2xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
            statusFilter === "all"
              ? "border-[#D4AF37] text-[#E0BE6F] bg-[#D4AF37]/10"
              : "border-white/10 text-white/50 hover:text-white"
          }`}
        >
          Tous ({sales.length})
        </button>
        {SALE_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
              statusFilter === s
                ? "border-[#D4AF37] text-[#E0BE6F] bg-[#D4AF37]/10"
                : "border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {SALE_STATUS_LABELS[s]} ({sales.filter((x) => x.status === s).length})
          </button>
        ))}
      </div>

      <TextInput
        placeholder="Rechercher référence, client, véhicule..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-14 text-center text-white/50">
          <Briefcase size={28} className="mx-auto mb-3 text-white/30" />
          Aucun dossier de vente. Convertissez un prospect depuis l&apos;onglet
          « Prospects ».
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[960px]">
              <thead>
                <tr className="bg-white/[0.04] text-left text-[10px] uppercase tracking-widest text-white/45">
                  <th className="px-4 py-3 font-bold">Référence</th>
                  <th className="px-4 py-3 font-bold">Client</th>
                  <th className="px-4 py-3 font-bold">Véhicule</th>
                  <th className="px-4 py-3 font-bold text-right">Prix</th>
                  <th className="px-4 py-3 font-bold text-center">Paiement</th>
                  <th className="px-4 py-3 font-bold text-center">Étape</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className="border-t border-white/[0.07] hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-[#E0BE6F] whitespace-nowrap">
                      {s.reference}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white whitespace-nowrap">
                        {s.customer
                          ? `${s.customer.first_name ?? ""} ${s.customer.last_name ?? ""}`.trim()
                          : s.customer_name ?? "—"}
                      </p>
                      <p className="text-[11px] text-white/40">
                        {s.customer?.email ?? s.customer_email ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-white/80 whitespace-nowrap">
                      {s.vehicle
                        ? `${s.vehicle.brand} ${s.vehicle.model}`
                        : "Supprimé"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      {formatMoney(s.agreed_price ?? s.asking_price)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Pill tone="neutral">
                        {PAYMENT_LABELS[s.payment_status] ?? s.payment_status}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Pill tone={SALE_STATUS_TONES[s.status] ?? "neutral"}>
                        {SALE_STATUS_LABELS[s.status] ?? s.status}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-white/55 whitespace-nowrap text-[12px]">
                      {formatDateTime(s.sold_at ?? s.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedId && (
        <SaleDetailModal
          saleId={selectedId}
          onClose={() => setSelectedId(null)}
          onChanged={load}
        />
      )}
    </div>
  );
}
