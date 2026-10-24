"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { revalidateCatalog } from "@/lib/admin/revalidate";
import {
  SALE_STATUSES,
  SALE_STATUS_LABELS,
  SALE_STATUS_TONES,
  PAYMENT_LABELS,
  formatDateTime,
  formatMoney,
} from "@/lib/sales";
import { Btn, Field, Modal, Notice, Pill, TextArea, TextInput } from "../ui";

// Étapes du pipeline et synchronisation du statut véhicule
const VEHICLE_SYNC = {
  negotiation: "reserved",
  ordered: "reserved",
  invoiced: "reserved",
  paid: "reserved",
  delivered: "sold",
  cancelled: "available",
};

const emptyForm = {
  status: "lead",
  agreed_price: "",
  deposit: "",
  payment_status: "pending",
  test_drive_at: "",
  notes: "",
};

export default function SaleDetailModal({ saleId, onClose, onChanged }) {
  const supabase = createClient();
  const [sale, setSale] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("vehicle_sales")
      .select(
        `*,
         vehicle:vehicles(id, slug, brand, model, sale_price, status),
         agent:profiles!vehicle_sales_agent_id_fkey(first_name, last_name)`
      )
      .eq("id", saleId)
      .single();
    if (err) setError(err.message);
    else {
      setSale(data);
      setForm({
        status: data.status,
        agreed_price: data.agreed_price ?? "",
        deposit: data.deposit ?? "",
        payment_status: data.payment_status,
        test_drive_at: data.test_drive_at
          ? new Date(data.test_drive_at).toISOString().slice(0, 16)
          : "",
        notes: data.notes ?? "",
      });
    }
    setLoading(false);
  }, [supabase, saleId]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function syncVehicle(vehicleId, wanted, slug) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("status")
      .eq("id", vehicleId)
      .single();
    if (!vehicle) return;
    // Ne jamais écraser une maintenance depuis le pipeline
    if (wanted === "available" && !["reserved", "sold"].includes(vehicle.status)) return;
    if (wanted === "reserved" && vehicle.status === "maintenance") return;
    await supabase.from("vehicles").update({ status: wanted }).eq("id", vehicleId);
    await revalidateCatalog(slug);
  }

  async function save(patch) {
    setSaving(true);
    setError(null);
    const merged = { ...form, ...patch };
    const nextStatus = patch.status ?? form.status;

    const payload = {
      status: nextStatus,
      agreed_price:
        merged.agreed_price === "" ? null : Number(merged.agreed_price),
      deposit: merged.deposit === "" ? 0 : Number(merged.deposit),
      payment_status: merged.payment_status,
      test_drive_at: merged.test_drive_at
        ? new Date(merged.test_drive_at).toISOString()
        : null,
      notes: merged.notes || null,
      sold_at: nextStatus === "delivered" ? new Date().toISOString() : null,
    };

    const { error: err } = await supabase
      .from("vehicle_sales")
      .update(payload)
      .eq("id", saleId);

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    if (sale.vehicle?.id && VEHICLE_SYNC[nextStatus]) {
      await syncVehicle(
        sale.vehicle.id,
        VEHICLE_SYNC[nextStatus],
        sale.vehicle.slug
      );
    }

    setSaving(false);
    await load();
    onChanged?.();
  }

  return (
    <Modal
      title={sale ? `Vente ${sale.reference}` : "Dossier de vente"}
      onClose={onClose}
      wide
    >
      {loading ? (
        <div className="flex items-center gap-2 text-white/50 py-10 justify-center">
          <Loader2 size={16} className="animate-spin" /> Chargement...
        </div>
      ) : error ? (
        <Notice type="error">{error}</Notice>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl font-bold text-white">
                {sale.vehicle
                  ? `${sale.vehicle.brand} ${sale.vehicle.model}`
                  : "Véhicule supprimé"}
              </p>
              <p className="text-sm text-white/50 mt-1">
                {sale.customer_name ?? "Client"} · {sale.customer_email ?? "—"}
                {sale.customer_phone ? ` · ${sale.customer_phone}` : ""}
              </p>
              {sale.agent && (
                <p className="text-[12px] text-white/40 mt-1">
                  Vendeur : {sale.agent.first_name} {sale.agent.last_name}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Pill tone={SALE_STATUS_TONES[sale.status] ?? "neutral"}>
                {SALE_STATUS_LABELS[sale.status]}
              </Pill>
              <Pill tone="neutral">Paiement : {PAYMENT_LABELS[sale.payment_status]}</Pill>
            </div>
          </div>

          {/* Étapes du pipeline */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F] mb-3">
              Étapes du pipeline
            </h4>
            <div className="flex flex-wrap gap-2">
              {SALE_STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={saving}
                  onClick={() => save({ status: s })}
                  className={`px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
                    form.status === s
                      ? "border-[#D4AF37] text-[#E0BE6F] bg-[#D4AF37]/10"
                      : "border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {SALE_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Tarification */}
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Prix affiché">
              <TextInput value={formatMoney(sale.asking_price)} disabled />
            </Field>
            <Field label="Prix négocié">
              <TextInput
                type="number"
                min="0"
                value={form.agreed_price}
                onChange={(e) => set("agreed_price", e.target.value)}
              />
            </Field>
            <Field label="Acompte versé">
              <TextInput
                type="number"
                min="0"
                value={form.deposit}
                onChange={(e) => set("deposit", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Statut du paiement">
              <select
                value={form.payment_status}
                onChange={(e) => set("payment_status", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]/60"
              >
                {Object.entries(PAYMENT_LABELS).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date d'essai">
              <TextInput
                type="datetime-local"
                value={form.test_drive_at}
                onChange={(e) => set("test_drive_at", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Notes de suivi">
            <TextArea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Négociation, reprises, financement, engagements client..."
            />
          </Field>

          {error && <Notice type="error">{error}</Notice>}

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <span className="text-[11px] text-white/35">
              Créé le {formatDateTime(sale.created_at)}
              {sale.sold_at && ` · vendu le ${formatDateTime(sale.sold_at)}`}
            </span>
            <div className="flex gap-3">
              <Btn variant="ghost" onClick={onClose}>
                Fermer
              </Btn>
              <Btn onClick={() => save({})} loading={saving}>
                Enregistrer
              </Btn>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
