"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Lock, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  estimateBooking,
  formatMoney,
  makeBookingReference,
  todayISO,
} from "@/lib/bookings";
import { Btn, Field, Notice, TextInput } from "@/components/admin/ui";

export default function BookingWidget({ car }) {
  const supabase = createClient();
  const rentable = car.businessLine !== "sale" && car.pricePerDay != null;

  const [sessionReady, setSessionReady] = useState(false);
  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickupNote, setPickupNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u);
      setSessionReady(true);
    })();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const estimate = useMemo(
    () =>
      estimateBooking(
        car.pricePerDay,
        startDate,
        endDate,
        car.depositAmount
      ),
    [car.pricePerDay, car.depositAmount, startDate, endDate]
  );

  const datesValid =
    startDate && endDate && new Date(endDate) >= new Date(startDate);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!datesValid) return;
    setSubmitting(true);
    setError(null);

    // 1) Contrôle de chevauchement via fonction Postgres
    const { data: available, error: rpcErr } = await supabase.rpc(
      "is_vehicle_available",
      {
        p_vehicle_id: car.id,
        p_start: startDate,
        p_end: endDate,
      }
    );

    if (rpcErr) {
      setError(rpcErr.message);
      setSubmitting(false);
      return;
    }
    if (!available) {
      setError(
        "Ce véhicule est déjà réservé sur tout ou partie de cette période. Choisissez d'autres dates."
      );
      setSubmitting(false);
      return;
    }

    // 2) Création de la réservation (RLS : le client ne crée que pour lui-même)
    const { data, error: insErr } = await supabase
      .from("bookings")
      .insert({
        reference: makeBookingReference(),
        vehicle_id: car.id,
        customer_id: user.id,
        status: "pending",
        start_date: startDate,
        end_date: endDate,
        pickup_note: pickupNote || null,
        daily_price: estimate.daily,
        total_amount: estimate.total,
        deposit_amount: estimate.deposit,
      })
      .select()
      .single();

    setSubmitting(false);
    if (insErr) {
      setError(
        insErr.code === "23503"
          ? "Impossible de réserver ce véhicule depuis cet aperçu : données de démonstration locales. En production, la réservation aboutira."
          : insErr.message
      );
      return;
    }
    setCreated(data);
  }

  if (!rentable) {
    return (
      <div
        className="rounded-[24px] p-8 mb-6 border border-white/10"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p className="font-display font-bold text-xl text-white mb-2">
          Vente uniquement
        </p>
        <p className="text-sm text-white/55 font-body">
          Ce véhicule n&apos;est pas proposé à la location. Contactez-nous pour
          une offre d&apos;achat.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[24px] p-8 mb-6 border border-white/10 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6B25E] to-transparent opacity-50" />

      <div className="flex items-center gap-2 mb-6">
        <CalendarCheck size={18} className="text-[#D6B25E]" />
        <h3 className="font-display font-bold text-lg text-white">
          Réserver ce véhicule
        </h3>
      </div>

      {created ? (
        <div className="space-y-4">
          <Notice type="success">
            Demande de réservation envoyée. Notre équipe la confirmera sous peu.
          </Notice>
          <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-1.5 text-sm">
            <p className="text-white/50 text-[11px] uppercase tracking-widest">
              Référence
            </p>
            <p className="font-bold text-[#E0BE6F]">{created.reference}</p>
            <p className="text-white/70 mt-2">
              {new Date(created.start_date).toLocaleDateString("fr-FR")} →{" "}
              {new Date(created.end_date).toLocaleDateString("fr-FR")}
            </p>
            <p className="text-white font-semibold">
              Total estimé : {formatMoney(created.total_amount)}
            </p>
          </div>
          <Link
            href="/account"
            className="block text-center w-full rounded-full py-3 text-[12px] font-bold uppercase tracking-widest bg-gradient-to-br from-[#E0BE6F] to-[#B68A2F] text-black"
          >
            Suivre mes locations
          </Link>
        </div>
      ) : !sessionReady ? (
        <div className="py-8 text-center text-white/50 text-sm">
          Vérification de la session...
        </div>
      ) : !user ? (
        <div className="space-y-4 text-center py-2">
          <Lock size={22} className="mx-auto text-white/40" />
          <p className="text-sm text-white/60 font-body">
            Connectez-vous pour vérifier les disponibilités et réserver en
            quelques secondes.
          </p>
          <Link
            href={`/login?next=/cars/${car.slug}`}
            className="block w-full rounded-full py-3 text-[12px] font-bold uppercase tracking-widest bg-gradient-to-br from-[#E0BE6F] to-[#B68A2F] text-black"
          >
            Se connecter / créer un compte
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] text-white/45">
            <UserCheck size={13} className="text-[#D6B25E]" />
            <span className="truncate">{user.email}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Départ">
              <TextInput
                type="date"
                required
                min={todayISO()}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>
            <Field label="Retour">
              <TextInput
                type="date"
                required
                min={startDate || todayISO()}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Lieu / remarque de prise en charge">
            <TextInput
              value={pickupNote}
              onChange={(e) => setPickupNote(e.target.value)}
              placeholder="Agence du Plateau, livraison hôtel..."
            />
          </Field>

          {datesValid && (
            <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-1 text-sm">
              <div className="flex justify-between text-white/60">
                <span>
                  {estimate.days} jour{estimate.days > 1 ? "s" : ""} ×{" "}
                  {formatMoney(estimate.daily)}
                </span>
                <span>{formatMoney(estimate.total)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Caution (restituée)</span>
                <span>{formatMoney(estimate.deposit)}</span>
              </div>
            </div>
          )}

          {error && <Notice type="error">{error}</Notice>}

          <Btn
            type="submit"
            loading={submitting}
            disabled={!datesValid}
            className="w-full"
          >
            Demander la réservation
          </Btn>
          <p className="text-[11px] text-white/35 text-center font-body">
            Aucun paiement maintenant — règlement à la confirmation (phase 7).
          </p>
        </form>
      )}
    </div>
  );
}
