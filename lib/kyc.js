// Libellés et constantes KYC partagés client/admin.
export const KYC_DOC_TYPES = [
  { value: "id_card", label: "Pièce d'identité (CNI / passeport)" },
  { value: "driver_license", label: "Permis de conduire" },
  { value: "proof_of_address", label: "Justificatif de domicile" },
  { value: "other", label: "Autre document" },
];

export const KYC_DOC_LABELS = Object.fromEntries(
  KYC_DOC_TYPES.map((t) => [t.value, t.label])
);

export const KYC_STATUS_LABELS = {
  pending: "En attente",
  approved: "Validé",
  rejected: "Rejeté",
};

export const KYC_STATUS_TONES = {
  pending: "gold",
  approved: "green",
  rejected: "red",
};

export const KYC_BUCKET = "customer-documents";
export const CONTRACTS_BUCKET = "contracts";

export function safeFileName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}
