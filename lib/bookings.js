// Helpers partagés (client et serveur) pour le moteur de location.
import { formatPrice } from "@/lib/utils";

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
];

export const BOOKING_STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  active: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

export const BOOKING_STATUS_TONES = {
  pending: "gold",
  confirmed: "blue",
  active: "green",
  completed: "neutral",
  cancelled: "red",
};

export const PAYMENT_STATUS_LABELS = {
  pending: "En attente",
  partial: "Partiel",
  paid: "Payé",
  refunded: "Remboursé",
  failed: "Échec",
};

// Nombre de jours locatifs, bornes incluses (1 jour si une seule date).
export function rentalDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const ms = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

export function estimateBooking(pricePerDay, startDate, endDate, deposit = 0) {
  const days = rentalDays(startDate, endDate);
  const daily = Number(pricePerDay) || 0;
  return {
    days,
    daily,
    total: Math.round(days * daily * 100) / 100,
    deposit: Number(deposit) || 0,
  };
}

// Référence lisible et unique : VLX-20261024-8K2PQ
export function makeBookingReference() {
  const d = new Date();
  const ymd =
    `${d.getFullYear()}` +
    `${String(d.getMonth() + 1).padStart(2, "0")}` +
    `${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `VLX-${ymd}-${rand}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatMoney(v) {
  return v == null ? "—" : formatPrice(v);
}
