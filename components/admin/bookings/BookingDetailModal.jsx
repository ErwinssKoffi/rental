"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  PlayCircle,
  StopCircle,
  XCircle,
  Upload,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { revalidateCatalog } from "@/lib/admin/revalidate";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONES,
  PAYMENT_STATUS_LABELS,
  formatDate,
  formatMoney,
} from "@/lib/bookings";
import { Btn, Field, Modal, Notice, Pill, TextArea, TextInput } from "../ui";
import ContractManager from "../documents/ContractManager";

function safeFileName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .toLowerCase();
}

const emptyInspection = {
  mileage: "",
  fuel_level: "",
  condition_notes: "",
  damages: "",
};

function InspectionForm({ kind, onSubmit, submitting }) {
  const [form, setForm] = useState(emptyInspection);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);
    await onSubmit({
      kind,
      mileage: form.mileage === "" ? null : Number(form.mileage),
      fuel_level: form.fuel_level === "" ? null : Number(form.fuel_level),
      condition_notes: form.condition_notes || null,
      damages: form.damages || null,
      files,
    });
    setUploading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
        État des lieux — {kind === "checkin" ? "prise en main" : "restitution"}
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Kilométrage (km)">
          <TextInput
            type="number"
            min="0"
            value={form.mileage}
            onChange={(e) => set("mileage", e.target.value)}
          />
        </Field>
        <Field label="Jauge carburant (%)">
          <TextInput
            type="number"
            min="0"
            max="100"
            value={form.fuel_level}
            onChange={(e) => set("fuel_level", e.target.value)}
          />
        </Field>
      </div>
      <Field label="État général">
        <TextArea
          value={form.condition_notes}
          onChange={(e) => set("condition_notes", e.target.value)}
          placeholder="Propreté, usure des pneus, niveaux..."
        />
      </Field>
      <Field label="Dommages constatés">
        <TextArea
          value={form.damages}
          onChange={(e) => set("damages", e.target.value)}
          placeholder="Rayure porte avant gauche, impact pare-chocs..."
        />
      </Field>
      <Field label="Photos (optionnel, multiple)">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="text-sm text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-[#D4AF37]/15 file:text-[#E0BE6F] file:px-4 file:py-2 file:text-[11px] file:font-bold file:uppercase file:tracking-widest"
        />
        {files.length > 0 && (
          <p className="text-[11px] text-white/45 mt-1">
            {files.length} fichier(s) à envoyer
          </p>
        )}
      </Field>
      <Btn type="submit" loading={submitting || uploading} className="w-full">
        <Upload size={14} />
        Valider l&apos;état des lieux
      </Btn>
    </form>
  );
}

function InspectionCard({ inspection }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
          {inspection.kind === "checkin" ? "Check-in" : "Check-out"}
        </h4>
        <span className="text-[11px] text-white/40">
          {new Date(inspection.created_at).toLocaleString("fr-FR")}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-white/70">
        <p>
          Kilométrage :{" "}
          <span className="text-white font-semibold">
            {inspection.mileage != null ? `${inspection.mileage} km` : "—"}
          </span>
        </p>
        <p>
          Carburant :{" "}
          <span className="text-white font-semibold">
            {inspection.fuel_level != null ? `${inspection.fuel_level}%` : "—"}
          </span>
        </p>
      </div>
      {inspection.condition_notes && (
        <p className="text-white/65">
          <span className="text-white/40">État : </span>
          {inspection.condition_notes}
        </p>
      )}
      {inspection.damages && (
        <p className="text-red-300/90">
          <span className="text-white/40">Dommages : </span>
          {inspection.damages}
        </p>
      )}
      {Array.isArray(inspection.photo_urls) && inspection.photo_urls.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {inspection.photo_urls.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Photo ${i + 1}`}
              className="w-20 h-16 object-cover rounded-lg border border-white/10"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingDetailModal({ bookingId, onClose, onChanged }) {
  const supabase = createClient();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showInspection, setShowInspection] = useState(null); // 'checkin' | 'checkout'

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("bookings")
      .select(
        `*,
         vehicle:vehicles(id, slug, brand, model, status, cover_image_url, plate_number, vin),
         customer:profiles!bookings_customer_id_fkey(id, first_name, last_name, phone, email),
         inspections:booking_inspections(*)
       `
      )
      .eq("id", bookingId)
      .single();

    if (err) setError(err.message);
    else setBooking(data);
    setLoading(false);
  }, [supabase, bookingId]);

  useEffect(() => {
    load();
  }, [load]);

  // Répercute le changement de statut véhicule seulement si aucun autre
  // dossier ouvert n'occupe le véhicule, et sans écraser maintenance/vendu.
  async function syncVehicleStatus(vehicleId, wanted) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("status")
      .eq("id", vehicleId)
      .single();

    if (!vehicle) return;
    if (wanted === "available") {
      const { data: others } = await supabase
        .from("bookings")
        .select("id")
        .eq("vehicle_id", vehicleId)
        .neq("id", bookingId)
        .in("status", ["pending", "confirmed", "active"])
        .limit(1);
      if (others?.length) return;
      if (!["reserved", "rented"].includes(vehicle.status)) return;
    }
    await supabase.from("vehicles").update({ status: wanted }).eq("id", vehicleId);
    await revalidateCatalog(booking.vehicle?.slug);
  }

  async function changeStatus(status, vehicleWanted) {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    if (vehicleWanted && booking.vehicle?.id) {
      await syncVehicleStatus(booking.vehicle.id, vehicleWanted);
    }
    setBusy(false);
    await load();
    onChanged?.();
  }

  async function submitInspection(payload) {
    setBusy(true);
    setError(null);

    // Upload des photos dans le bucket dédié
    const photoUrls = [];
    for (const file of payload.files) {
      const path = `${booking.reference}/${payload.kind}-${Date.now()}-${safeFileName(file.name)}`;
      const { error: upErr } = await supabase.storage
        .from("booking-media")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setError(upErr.message);
        setBusy(false);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("booking-media").getPublicUrl(path);
      photoUrls.push(publicUrl);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insErr } = await supabase
      .from("booking_inspections")
      .insert({
        booking_id: bookingId,
        kind: payload.kind,
        inspector_id: user?.id ?? null,
        mileage: payload.mileage,
        fuel_level: payload.fuel_level,
        condition_notes: payload.condition_notes,
        damages: payload.damages,
        photo_urls: photoUrls,
      });

    if (insErr) {
      setError(insErr.message);
      setBusy(false);
      return;
    }

    // Transition de cycle de vie associée
    if (payload.kind === "checkin") {
      await changeStatus("active", "rented");
    } else {
      await changeStatus("completed", "available");
    }
    setShowInspection(null);
    setBusy(false);
  }

  const inspections = booking?.inspections ?? [];
  const checkin = inspections.find((i) => i.kind === "checkin");
  const checkout = inspections.find((i) => i.kind === "checkout");

  return (
    <Modal
      title={booking ? `Réservation ${booking.reference}` : "Réservation"}
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
          {/* En-tête */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl font-bold text-white">
                {booking.vehicle
                  ? `${booking.vehicle.brand} ${booking.vehicle.model}`
                  : "Véhicule supprimé"}
              </p>
              <p className="text-sm text-white/50 mt-1">
                {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Pill tone={BOOKING_STATUS_TONES[booking.status] ?? "neutral"}>
                {BOOKING_STATUS_LABELS[booking.status]}
              </Pill>
              <Pill tone="neutral">
                Paiement : {PAYMENT_STATUS_LABELS[booking.payment_status]}
              </Pill>
            </div>
          </div>

          {/* Informations */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-2 text-sm">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
                Client
              </h4>
              <p className="text-white font-semibold">
                {[booking.customer?.first_name, booking.customer?.last_name]
                  .filter(Boolean)
                  .join(" ") || "—"}
              </p>
              <p className="text-white/60">{booking.customer?.email ?? "—"}</p>
              <p className="text-white/60">{booking.customer?.phone ?? "Pas de téléphone"}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-2 text-sm">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E0BE6F]">
                Tarification
              </h4>
              <p className="text-white/70">
                Tarif journalier : {formatMoney(booking.daily_price)}
              </p>
              <p className="text-white font-semibold text-lg">
                Total : {formatMoney(booking.total_amount)}
              </p>
              <p className="text-white/70">
                Caution : {formatMoney(booking.deposit_amount)}
              </p>
              {booking.pickup_note && (
                <p className="text-white/55 pt-1 border-t border-white/10 mt-2 pt-3">
                  Note prise en charge : {booking.pickup_note}
                </p>
              )}
            </div>
          </div>

          {/* Actions de cycle de vie */}
          <div className="flex flex-wrap gap-3">
            {booking.status === "pending" && (
              <>
                <Btn
                  onClick={() => changeStatus("confirmed", "reserved")}
                  loading={busy}
                >
                  <CheckCircle2 size={15} />
                  Confirmer
                </Btn>
                <Btn
                  variant="danger"
                  onClick={() => changeStatus("cancelled", "available")}
                  loading={busy}
                >
                  <XCircle size={15} />
                  Refuser / annuler
                </Btn>
              </>
            )}
            {booking.status === "confirmed" && (
              <>
                <Btn onClick={() => setShowInspection("checkin")} loading={busy}>
                  <PlayCircle size={15} />
                  Démarrer (check-in)
                </Btn>
                <Btn
                  variant="danger"
                  onClick={() => changeStatus("cancelled", "available")}
                  loading={busy}
                >
                  <XCircle size={15} />
                  Annuler
                </Btn>
              </>
            )}
            {booking.status === "active" && (
              <Btn onClick={() => setShowInspection("checkout")} loading={busy}>
                <StopCircle size={15} />
                Terminer (check-out)
              </Btn>
            )}
            {(booking.status === "completed" || booking.status === "cancelled") && (
              <Notice type="info">
                Dossier clôturé — aucune action supplémentaire.
              </Notice>
            )}
          </div>

          {showInspection && (
            <InspectionForm
              kind={showInspection}
              submitting={busy}
              onSubmit={submitInspection}
            />
          )}

          {/* Contrat PDF */}
          <ContractManager kind="rental" booking={booking} />

          {/* États des lieux existants */}
          {(checkin || checkout) && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/45">
                États des lieux
              </h4>
              {checkin && <InspectionCard inspection={checkin} />}
              {checkout && <InspectionCard inspection={checkout} />}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
