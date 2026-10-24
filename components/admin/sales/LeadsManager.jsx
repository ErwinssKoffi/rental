"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { UserPlus, ArrowRightLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_TONES,
  LEAD_SOURCE_LABELS,
  makeSaleReference,
} from "@/lib/sales";
import { formatDate } from "@/lib/bookings";
import { Pill, Spinner, Notice, TextInput, Btn } from "../ui";

export default function LeadsManager({ onChanged }) {
  const supabase = createClient();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("leads")
      .select(
        `*, vehicle:vehicles(id, slug, brand, model, sale_price, status)`
      )
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setLeads(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      return [l.first_name, l.last_name, l.email, l.phone, l.vehicle?.brand, l.vehicle?.model]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [leads, statusFilter, search]);

  async function updateStatus(lead, status) {
    setBusyId(lead.id);
    const { error: err } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", lead.id);
    if (err) setError(err.message);
    else {
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
      onChanged?.();
    }
    setBusyId(null);
  }

  async function convertToSale(lead) {
    if (!lead.vehicle) {
      setError("Ce prospect n'est lié à aucun véhicule.");
      return;
    }
    const ok = window.confirm(
      `Créer un dossier de vente pour ${lead.first_name} ${lead.last_name} « ${lead.vehicle.brand} ${lead.vehicle.model} » ?`
    );
    if (!ok) return;

    setBusyId(lead.id);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    const { error: saleErr } = await supabase.from("vehicle_sales").insert({
      reference: makeSaleReference(),
      vehicle_id: lead.vehicle.id,
      customer_id: lead.customer_id ?? null,
      customer_name: `${lead.first_name} ${lead.last_name}`.trim(),
      customer_email: lead.email,
      customer_phone: lead.phone,
      lead_id: lead.id,
      agent_id: userData.user?.id ?? null,
      status: "lead",
      asking_price: lead.vehicle.sale_price ?? null,
    });

    if (saleErr) {
      setError(
        saleErr.code === "23505"
          ? "Un dossier de vente actif existe déjà pour ce véhicule."
          : saleErr.message
      );
      setBusyId(null);
      return;
    }

    const { error: leadErr } = await supabase
      .from("leads")
      .update({ status: "converted" })
      .eq("id", lead.id);
    if (leadErr) setError(leadErr.message);

    await load();
    onChanged?.();
    setBusyId(null);
  }

  if (loading) return <Spinner label="Chargement des prospects..." />;

  return (
    <div className="space-y-5">
      {error && <Notice type="error">{error}</Notice>}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
            statusFilter === "all"
              ? "border-[#D4AF37] text-[#E0BE6F] bg-[#D4AF37]/10"
              : "border-white/10 text-white/50 hover:text-white"
          }`}
        >
          Tous ({leads.length})
        </button>
        {LEAD_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
              statusFilter === s
                ? "border-[#D4AF37] text-[#E0BE6F] bg-[#D4AF37]/10"
                : "border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {LEAD_STATUS_LABELS[s]} ({leads.filter((l) => l.status === s).length})
          </button>
        ))}
      </div>

      <TextInput
        placeholder="Rechercher nom, e-mail, véhicule..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-14 text-center text-white/50">
          <UserPlus size={28} className="mx-auto mb-3 text-white/30" />
          Aucun prospect{statusFilter !== "all" && " pour ce statut"}.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div
              key={l.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 flex flex-wrap items-center gap-4"
            >
              <div className="flex-1 min-w-[220px]">
                <p className="font-semibold text-white">
                  {l.first_name} {l.last_name}
                </p>
                <p className="text-[12px] text-white/50">
                  {l.email} · {l.phone ?? "pas de téléphone"}
                </p>
                <p className="text-[12px] text-[#E0BE6F] mt-1">
                  {l.vehicle
                    ? `${l.vehicle.brand} ${l.vehicle.model}`
                    : "Véhicule dissocié"}
                  {" · "}
                  <span className="text-white/40">
                    {LEAD_SOURCE_LABELS[l.source] ?? l.source} · {formatDate(l.created_at)}
                  </span>
                </p>
                {l.message && (
                  <p className="text-[12px] text-white/55 mt-2 italic line-clamp-2">
                    “{l.message}”
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Pill tone={LEAD_STATUS_TONES[l.status] ?? "neutral"}>
                  {LEAD_STATUS_LABELS[l.status] ?? l.status}
                </Pill>
                <select
                  value={l.status}
                  disabled={busyId === l.id}
                  onChange={(e) => updateStatus(l, e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]/60"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                {l.status !== "converted" && l.vehicle && (
                  <Btn
                    variant="ghost"
                    className="!px-4 !py-2"
                    loading={busyId === l.id}
                    onClick={() => convertToSale(l)}
                  >
                    <ArrowRightLeft size={13} />
                    Convertir
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
