"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONES,
  formatDate,
  formatMoney,
} from "@/lib/bookings";
import { Pill, Spinner, Notice, TextInput } from "../ui";
import BookingDetailModal from "./BookingDetailModal";

export default function BookingsManager() {
  const supabase = createClient();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("bookings")
      .select(
        `*,
         vehicle:vehicles(id, slug, brand, model, cover_image_url, status),
         customer:profiles!bookings_customer_id_fkey(id, first_name, last_name, phone, email)`
      )
      .order("created_at", { ascending: false });

    if (err) setError(err.message);
    else setBookings(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const acc = { all: bookings.length };
    for (const s of BOOKING_STATUSES) {
      acc[s] = bookings.filter((b) => b.status === s).length;
    }
    return acc;
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [
        b.reference,
        b.vehicle?.brand,
        b.vehicle?.model,
        b.customer?.first_name,
        b.customer?.last_name,
        b.customer?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [bookings, statusFilter, search]);

  if (loading) return <Spinner label="Chargement des réservations..." />;

  return (
    <div className="space-y-6">
      {/* Compteurs par statut */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
            statusFilter === "all"
              ? "border-[#D4AF37] text-[#E0BE6F] bg-[#D4AF37]/10"
              : "border-white/10 text-white/50 hover:text-white"
          }`}
        >
          Toutes ({stats.all})
        </button>
        {BOOKING_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-colors ${
              statusFilter === s
                ? "border-[#D4AF37] text-[#E0BE6F] bg-[#D4AF37]/10"
                : "border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {BOOKING_STATUS_LABELS[s]} ({stats[s] ?? 0})
          </button>
        ))}
      </div>

      <TextInput
        placeholder="Rechercher référence, client, véhicule..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {error && <Notice type="error">{error}</Notice>}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-14 text-center text-white/50">
          <CalendarClock size={28} className="mx-auto mb-3 text-white/30" />
          Aucune réservation{statusFilter !== "all" && " pour ce statut"}.
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
                  <th className="px-4 py-3 font-bold">Période</th>
                  <th className="px-4 py-3 font-bold text-right">Montant</th>
                  <th className="px-4 py-3 font-bold text-center">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className="border-t border-white/[0.07] hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-[#E0BE6F] whitespace-nowrap">
                      {b.reference}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white whitespace-nowrap">
                        {[b.customer?.first_name, b.customer?.last_name]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </p>
                      <p className="text-[11px] text-white/40">
                        {b.customer?.email ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-white/80 whitespace-nowrap">
                      {b.vehicle
                        ? `${b.vehicle.brand} ${b.vehicle.model}`
                        : "Supprimé"}
                    </td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                      {formatDate(b.start_date)} → {formatDate(b.end_date)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                      {formatMoney(b.total_amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Pill tone={BOOKING_STATUS_TONES[b.status] ?? "neutral"}>
                        {BOOKING_STATUS_LABELS[b.status] ?? b.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <BookingDetailModal
          bookingId={selected.id}
          onClose={() => setSelected(null)}
          onChanged={load}
        />
      )}
    </div>
  );
}
