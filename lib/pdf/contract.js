// Génération de contrats PDF avec pdf-lib (aucune dépendance native,
// exécutable dans le navigateur). Polices standard WinAnsi : les accents
// français utilisés (é è à ç ê î ô ù û ë ï...) sont pris en charge.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const GOLD = rgb(0.72, 0.6, 0.22);
const DARK = rgb(0.08, 0.08, 0.08);
const GRAY = rgb(0.42, 0.42, 0.42);

const MARGIN = 56;
const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function wrapText(font, text, size, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildContractPdf({ kind, reference, data }) {
  const doc = await PDFDocument.create();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const ensureSpace = (needed) => {
    if (y - needed < MARGIN) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  };

  const heading = (text) => {
    ensureSpace(34);
    y -= 18;
    page.drawText(text, { x: MARGIN, y, size: 13, font: bold, color: GOLD });
    y -= 8;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.8,
      color: GOLD,
    });
    y -= 14;
  };

  const paragraph = (text, size = 10, color = DARK, font = helvetica, gap = 5) => {
    const lines = wrapText(font, text, size, CONTENT_WIDTH);
    for (const line of lines) {
      ensureSpace(size + 4);
      y -= size;
      page.drawText(line, { x: MARGIN, y, size, font, color });
      y -= gap;
    }
  };

  const field = (label, value) => {
    ensureSpace(20);
    y -= 14;
    page.drawText(label, { x: MARGIN, y, size: 9, font: bold, color: GRAY });
    const val = String(value ?? "—");
    const lines = wrapText(helvetica, val, 10, CONTENT_WIDTH);
    lines.forEach((line, i) => {
      if (i > 0) y -= 13;
      page.drawText(line, { x: MARGIN, y: 10, size: 10, font: helvetica, color: DARK });
    });
    y -= 6;
  };

  // ── En-tête ──
  page.drawText("VELOX RENTALS", {
    x: MARGIN, y, size: 20, font: bold, color: GOLD,
  });
  y -= 16;
  page.drawText("Vente & location de véhicules — Abidjan, Plateau", {
    x: MARGIN, y, size: 9, font: helvetica, color: GRAY,
  });
  y -= 24;
  page.drawText(
    kind === "rental" ? "CONTRAT DE LOCATION" : "CONTRAT DE VENTE",
    { x: MARGIN, y, size: 16, font: bold, color: DARK }
  );
  y -= 16;
  page.drawText(`Référence : ${reference}`, {
    x: MARGIN, y, size: 10, font: bold, color: DARK,
  });
  y -= 14;
  page.drawText(`Établi le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}`, {
    x: MARGIN, y, size: 9, font: helvetica, color: GRAY,
  });

  // ── Parties ──
  heading("1. Parties contractantes");
  field("Loueur / Vendeur", "Velox Rentals — Abidjan Plateau, Côte d'Ivoire");
  field(
    kind === "rental" ? "Locataire / Client" : "Acheteur / Client",
    data.customerName
  );
  field("E-mail", data.customerEmail);
  if (data.customerPhone) field("Téléphone", data.customerPhone);

  // ── Véhicule ──
  heading("2. Véhicule");
  field("Marque et modèle", `${data.vehicleBrand} ${data.vehicleModel}`);
  if (data.plateNumber) field("Immatriculation", data.plateNumber);
  if (data.vin) field("VIN", data.vin);

  if (kind === "rental") {
    heading("3. Conditions de location");
    field("Période", `Du ${data.startDate} au ${data.endDate} (${data.days} jour(s))`);
    field("Tarif journalier", data.dailyPrice);
    field("Montant total", data.totalAmount);
    field("Caution (restituable)", data.deposit);
    field("Statut du paiement", data.paymentStatus);
    if (data.pickupNote) field("Remarque de prise en charge", data.pickupNote);

    heading("4. Engagements du locataire");
    paragraph(
      "Le locataire s'engage à restituer le véhicule dans l'état constaté lors du check-in, " +
        "à la date et au lieu convenus. Le véhicule ne peut être sous-loué ni confié à un tiers " +
        "non déclaré. Tout dommage, contravention ou accident engage la responsabilité du " +
        "locataire dans les limites prévues par l'assurance tous risques souscrite. La caution " +
        "est restituée après check-out, déduction faite d'éventuels frais de remise en état."
    );
  } else {
    heading("3. Conditions de vente");
    field("Prix affiché", data.askingPrice);
    field("Prix convenu", data.agreedPrice);
    field("Acompte versé", data.deposit);
    field("Statut du paiement", data.paymentStatus);
    if (data.testDriveAt) field("Essai réalisé le", data.testDriveAt);

    heading("4. Engagements du vendeur");
    paragraph(
      "Le vendeur garantit la conformité administrative du véhicule et la libre disposition " +
        "du bien. La propriété est transférée à l'acheteur après complet paiement du prix " +
        "convenu et livraison dûment constatée. Les frais d'immatriculation et les formalités " +
        "sont à la charge précisée lors de la commande."
    );
  }

  heading("5. Signatures");
  paragraph("Fait à Abidjan, en deux (2) exemplaires originaux.", 10, DARK, helvetica, 26);
  ensureSpace(120);
  const colWidth = CONTENT_WIDTH / 2;
  page.drawText("Le client", { x: MARGIN, y, size: 9, font: bold, color: GRAY });
  page.drawText("Pour Velox Rentals", {
    x: MARGIN + colWidth, y, size: 9, font: bold, color: GRAY,
  });
  y -= 70;
  page.drawLine({
    start: { x: MARGIN, y }, end: { x: MARGIN + colWidth - 30, y },
    thickness: 0.6, color: GRAY,
  });
  page.drawLine({
    start: { x: MARGIN + colWidth, y }, end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.6, color: GRAY,
  });
  y -= 16;
  page.drawText("Signature (précédée de « lu et approuvé »)", {
    x: MARGIN, y, size: 8, font: helvetica, color: GRAY,
  });
  page.drawText("Cachet et signature", {
    x: MARGIN + colWidth, y, size: 8, font: helvetica, color: GRAY,
  });

  return doc.save();
}
