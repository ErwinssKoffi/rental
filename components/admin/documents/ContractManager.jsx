"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileSignature, Download, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildContractPdf } from "@/lib/pdf/contract";
import { CONTRACTS_BUCKET, safeFileName } from "@/lib/kyc";
import { formatMoney, formatDateTime, PAYMENT_LABELS } from "@/lib/sales";
import { Btn, Notice } from "../ui";

// Génère, stocke et liste les contrats PDF d'une réservation ou d'une vente.
export default function ContractManager({ kind, booking = null, sale = null }) {
  const supabase = useRef(createClient()).current;
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const refId = booking?.id ?? sale?.id;

  const load = useCallback(async () => {
    if (!refId) return;
    const filter =
      kind === "rental"
        ? supabase.from("contracts").select("*").eq("booking_id", refId)
        : supabase.from("contracts").select("*").eq("sale_id", refId);
    const { data, error: err } = await filter.order("created_at", {
      ascending: false,
    });
    if (err) setError(err.message);
    else setContracts(data ?? []);
    setLoading(false);
  }, [supabase, refId, kind]);

  useEffect(() => {
    load();
  }, [load]);

  async function generate() {
    setBusy(true);
    setError(null);
    setInfo(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const vehicle = booking?.vehicle ?? sale?.vehicle;
    const customerName =
      booking?.customer
        ? [booking.customer.first_name, booking.customer.last_name]
            .filter(Boolean)
            .join(" ")
        : sale?.customer_name ?? "Client";

    const reference =
      kind === "rental"
        ? `CTR-L-${booking.reference}`
        : `CTR-V-${sale.reference}`;

    const pdfData =
      kind === "rental"
        ? {
            kind,
            reference,
            data: {
              customerName,
              customerEmail: booking.customer?.email ?? "—",
              customerPhone: booking.customer?.phone,
              vehicleBrand: vehicle?.brand,
              vehicleModel: vehicle?.model,
              plateNumber: booking.vehicle?.plate_number,
              vin: booking.vehicle?.vin,
              startDate: formatDateTime(booking.start_date).split(" à")[0],
              endDate: formatDateTime(booking.end_date).split(" à")[0],
              days: booking.total_amount && booking.daily_price
                ? Math.round(Number(booking.total_amount) / Number(booking.daily_price))
                : "—",
              dailyPrice: formatMoney(booking.daily_price),
              totalAmount: formatMoney(booking.total_amount),
              deposit: formatMoney(booking.deposit_amount),
              paymentStatus: PAYMENT_LABELS[booking.payment_status] ?? booking.payment_status,
              pickupNote: booking.pickup_note,
            },
          }
        : {
            kind,
            reference,
            data: {
              customerName,
              customerEmail: sale.customer_email ?? "—",
              customerPhone: sale.customer_phone,
              vehicleBrand: vehicle?.brand,
              vehicleModel: vehicle?.model,
              plateNumber: sale.vehicle?.plate_number,
              vin: sale.vehicle?.vin,
              askingPrice: formatMoney(sale.asking_price),
              agreedPrice: formatMoney(sale.agreed_price ?? sale.asking_price),
              deposit: formatMoney(sale.deposit),
              paymentStatus: PAYMENT_LABELS[sale.payment_status] ?? sale.payment_status,
              testDriveAt: sale.test_drive_at ? formatDateTime(sale.test_drive_at) : null,
            },
          };

    const bytes = await buildContractPdf(pdfData);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const ownerFolder =
      booking?.customer_id ?? sale?.customer_id ?? "walkin";
    const path = `${ownerFolder}/${safeFileName(reference)}.pdf`;

    const { error: upErr } = await supabase.storage
      .from(CONTRACTS_BUCKET)
      .upload(path, blob, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: true,
      });

    if (upErr) {
      setError(upErr.message);
      setBusy(false);
      return;
    }

    const { error: insErr } = await supabase.from("contracts").insert({
      reference,
      type: kind,
      booking_id: kind === "rental" ? booking.id : null,
      sale_id: kind === "sale" ? sale.id : null,
      customer_id: booking?.customer_id ?? sale?.customer_id ?? null,
      file_name: `${reference}.pdf`,
      storage_path: path,
      generated_by: user?.id ?? null,
    });

    if (insErr) {
      setError(insErr.message);
      setBusy(false);
      return;
    }

    setInfo("Contrat généré et stocké dans l'espace documentaire privé.");
    setBusy(false);
    await load();
  }

  async function download(c) {
    setBusyId(c.id);
    const { data, error: err } = await supabase.storage
      .from(CONTRACTS_BUCKET)
      .createSignedUrl(c.storage_path, 300);
    setBusyId(null);
    if (err) setError(err.message);
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function remove(c) {
    const ok = window.confirm(`Supprimer le contrat ${c.reference} ?`);
    if (!ok) return;
    setBusyId(c.id);
    await supabase.storage.from(CONTRACTS_BUCKET).remove([c.storage_path]);
    const { error: err } = await supabase
      .from("contracts")
      .delete()
      .eq("id", c.id);
    if (err) setError(err.message);
    else await load();
    setBusyId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/50 py-4">
        <Loader2 size={15} className="animate-spin" /> Chargement des contrats...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F] flex items-center gap-2">
          <FileSignature size={14} />
          Contrats PDF
        </h4>
        <Btn onClick={generate} loading={busy} className="!px-4 !py-2">
          <FileSignature size={13} />
          Générer le contrat
        </Btn>
      </div>

      {error && <Notice type="error">{error}</Notice>}
      {info && <Notice type="success">{info}</Notice>}

      {contracts.length === 0 ? (
        <p className="text-sm text-white/40 italic">Aucun contrat généré.</p>
      ) : (
        <div className="space-y-2">
          {contracts.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-lg border border-white/[0.07] px-4 py-3"
            >
              <FileSignature size={16} className="text-[#D4AF37] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {c.reference}
                </p>
                <p className="text-[11px] text-white/40">
                  {formatDateTime(c.created_at)}
                </p>
              </div>
              <button
                onClick={() => download(c)}
                disabled={busyId === c.id}
                className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-[#E0BE6F] hover:border-[#D4AF37]/40 transition-colors"
                title="Télécharger (URL signée)"
              >
                {busyId === c.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
              </button>
              <button
                onClick={() => remove(c)}
                disabled={busyId === c.id}
                className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-300 hover:border-red-500/40 transition-colors"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
