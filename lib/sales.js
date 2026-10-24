// Helpers partagés du moteur de vente (libellés, tons, références).
import { formatPrice } from "@/lib/utils";

export const SALE_STATUSES = [
  "lead",
  "negotiation",
  "ordered",
  "invoiced",
  "paid",
  "delivered",
  "cancelled",
];

export const SALE_STATUS_LABELS = {
  lead: "Prospect",
  negotiation: "Négociation",
  ordered: "Commandé",
  invoiced: "Facturé",
  paid: "Payé",
  delivered: "Livré",
  cancelled: "Annulé",
};

export const SALE_STATUS_TONES = {
  lead: "neutral",
  negotiation: "gold",
  ordered: "blue",
  invoiced: "blue",
  paid: "green",
  delivered: "green",
  cancelled: "red",
};

export const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"];

export const LEAD_STATUS_LABELS = {
  new: "Nouveau",
  contacted: "Contacté",
  qualified: "Qualifié",
  converted: "Converti",
  lost: "Perdu",
};

export const LEAD_STATUS_TONES = {
  new: "gold",
  contacted: "blue",
  qualified: "blue",
  converted: "green",
  lost: "red",
};

export const LEAD_SOURCES = [
  "contact_form",
  "list_car",
  "test_drive",
  "callback",
  "phone",
  "other",
];

export const LEAD_SOURCE_LABELS = {
  contact_form: "Formulaire contact",
  list_car: "Fiche véhicule",
  test_drive: "Essai",
  callback: "Rappel demandé",
  phone: "Téléphone",
  other: "Autre",
};

export const PAYMENT_LABELS = {
  pending: "En attente",
  partial: "Partiel",
  paid: "Payé",
  refunded: "Remboursé",
  failed: "Échec",
};

// Référence vente : VTX-20261024-7QZ9K
export function makeSaleReference() {
  const d = new Date();
  const ymd =
    `${d.getFullYear()}` +
    `${String(d.getMonth() + 1).padStart(2, "0")}` +
    `${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `VTX-${ymd}-${rand}`;
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export { formatPrice as formatMoney };
