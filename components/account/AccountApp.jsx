"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Car,
  LogOut,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONES,
  PAYMENT_STATUS_LABELS,
  formatDate,
  formatMoney,
} from "@/lib/bookings";
import { Pill, Spinner, Notice, Btn } from "@/components/admin/ui";

function StatusPill({ status }) {
  return (
    <Pill tone={BOOKING_STATUS_TONES[status] ?? "neutral"}>
      {BOOKING_STATUS_LABELS[status] ?? status}
    </Pill>
  );
}

export default function AccountApp() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    setUser(u);

    if (!u) {
      setLoading(false);
      return;
    }

    const [{ data: prof, error: profErr }, { data: bks, error: bkErr }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("first_name, last_name, phone, role, kyc_verified, is_active")
          .eq("id", u.id)
          .single(),
        supabase
          .from("bookings")
          .select(
            "*, vehicle:vehicles(id, slug, brand, model, cover_image_url)"
          )
          .order("created_at", { ascending: false }),
      ]);

    if (profErr) setError(profErr.message);
    else setProfile(prof);
    if (bkErr) setError(bkErr.message);
    else setBookings(bks ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function cancelBooking(b) {
    const ok = window.confirm(
      `Annuler la réservation ${b.reference} (${formatDate(b.start_date)} → ${formatDate(b.end_date)}) ?`
    );
    if (!ok) return;
    const { error: err } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", b.id)
      .eq("status", "pending");
    if (err) setError(err.message);
    else load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setBookings([]);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Spinner label="Chargement de votre espace..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10">
          <ShieldCheck size={34} className="mx-auto text-[#D4AF37] mb-4" />
          <h1 className="font-display text-2xl font-bold text-white mb-3">
            Connexion requise
          </h1>
          <p className="text-white/55 text-sm font-body mb-6">
            Connectez-vous pour accéder à vos locations, documents et factures.
          </p>
          <Link
            href="/login?next=/account"
            className="block w-full rounded-full py-3 text-[12px] font-bold uppercase tracking-widest bg-gradient-to-br from-[#E0BE6F] to-[#B68A2F] text-black"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user.email;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* En-tête */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">Espace client</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mt-2">
              Bonjour, {fullName}
            </h1>
            <p className="text-white/50 text-sm mt-2 font-body">{user.email}</p>
            <div className="flex items-center gap-3 mt-3">
              <Pill tone="gold" >
                {profile?.role === "customer" ? "Client Velox" : profile?.role}
              </Pill>
              {profile?.kyc_verified ? (
                <Pill tone="green">
                  <span className="inline-flex items-center gap-1">
                    <BadgeCheck size={12} /> KYC vérifié
                  </span>
                </Pill>
              ) : (
                <Pill tone="neutral">KYC en attente</Pill>
              )}
            </div>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:border-red-500/50 hover:text-red-300 transition-colors"
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>

        {error && (
          <div className="mb-6">
            <Notice type="error">{error}</Notice>
          </div>
        )}

        {/* Locations */}
        <section>
          <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-5">
            <CalendarDays size={18} className="text-[#D4AF37]" />
            Mes locations ({bookings.length})
          </h2>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-14 text-center">
              <Car size={30} className="mx-auto text-white/30 mb-4" />
              <p className="text-white/55 font-body mb-5">
                Vous n&apos;avez encore aucune réservation.
              </p>
              <Link
                href="/cars"
                className="inline-block rounded-full px-6 py-3 text-[12px] font-bold uppercase tracking-widest bg-gradient-to-br from-[#E0BE6F] to-[#B68A2F] text-black"
              >
                Découvrir la flotte
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <article
                  key={b.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-wrap items-center gap-5"
                >
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-white/[0.06] shrink-0 flex items-center justify-center">
                    {b.vehicle?.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.vehicle.cover_image_url}
                        alt={`${b.vehicle.brand} ${b.vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car size={20} className="text-white/30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[11px] text-white/40 uppercase tracking-widest">
                      {b.reference}
                    </p>
                    <Link
                      href={`/cars/${b.vehicle?.slug ?? ""}`}
                      className="font-semibold text-white hover:text-[#E0BE6F] transition-colors"
                    >
                      {b.vehicle
                        ? `${b.vehicle.brand} ${b.vehicle.model}`
                        : "Véhicule"}
                    </Link>
                    <p className="text-sm text-white/55 mt-1">
                      {formatDate(b.start_date)} → {formatDate(b.end_date)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{formatMoney(b.total_amount)}</p>
                    <p className="text-[11px] text-white/45 mt-0.5">
                      Paiement : {PAYMENT_STATUS_LABELS[b.payment_status] ?? b.payment_status}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusPill status={b.status} />
                    {b.status === "pending" && (
                      <Btn
                        variant="danger"
                        className="!px-4 !py-2"
                        onClick={() => cancelBooking(b)}
                      >
                        Annuler
                      </Btn>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
