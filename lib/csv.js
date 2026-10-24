// Génération et téléchargement d'un fichier CSV côté navigateur.
function escapeCell(value) {
  if (value == null) return "";
  const s = String(value);
  if (/[",;\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsv(rows, columns) {
  const header = columns.map((c) => escapeCell(c.label)).join(";");
  const body = rows
    .map((row) =>
      columns.map((c) => escapeCell(typeof c.value === "function" ? c.value(row) : row[c.key])).join(";")
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function downloadCsv(filename, rows, columns) {
  // BOM UTF-8 pour une ouverture correcte dans Excel (accents)
  const csv = "\uFEFF" + rowsToCsv(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
