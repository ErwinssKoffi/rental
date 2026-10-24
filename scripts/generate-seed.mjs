// Génère les seeds Supabase à partir du catalogue statique data/cars.js
// Usage : node scripts/generate-seed.mjs
// Sorties :
//   supabase/seed/01_categories_agencies.sql
//   supabase/seed/02_vehicles.sql
//   supabase/seed/03_media.sql (découpé en 03a/03b si volumineux)
//   supabase/seed.sql = concaténation (script complet idempotent)
import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "supabase", "seed");
await mkdir(outDir, { recursive: true });

const src = await readFile(join(root, "data/cars.js"), "utf8");
const tmp = join(tmpdir(), `cars-seed-${process.pid}.mjs`);
await writeFile(tmp, src);
const { default: cars } = await import(pathToFileURL(tmp).href);
await rm(tmp);

const esc = (v) =>
  v === null || v === undefined
    ? "null::text"
    : `'${String(v).replace(/'/g, "''")}'`;
const num = (v) => (v === null || v === undefined || Number.isNaN(v) ? "null" : String(v));
const jsonb = (v) => `'${JSON.stringify(v ?? []).replace(/'/g, "''")}'::jsonb`;
const t = (v) => (v === null || v === undefined ? "null::text" : esc(v));

const CATEGORY_LABELS = { economy: "Economy", suv: "SUV", luxury: "Luxury", sports: "Sports" };
const AGENCY = "Velox Rentals — Abidjan Plateau";

// ---- 01 : catégories + agence ----
const catLines = [
  "-- 01 — Catégories et agence (idempotent)",
  "begin;",
  "insert into public.categories (name, slug, description, sort_order, is_active) values",
];
const types = [...new Set(cars.map((c) => c.type))].sort();
catLines.push(
  types
    .map(
      (slug, i) =>
        `  (${esc(CATEGORY_LABELS[slug] ?? slug)}, ${esc(slug)}, ${esc(
          "Véhicules de catégorie " + (CATEGORY_LABELS[slug] ?? slug)
        )}, ${i + 1}, true)`
    )
    .join(",\n")
);
catLines.push(`on conflict (slug) do update set
  name = excluded.name, description = excluded.description,
  sort_order = excluded.sort_order, is_active = true;`);
catLines.push(`
insert into public.agencies (name, address, city, phone, email, location, is_active)
values (
  ${esc(AGENCY)}, 'Boulevard Roume, Le Plateau', 'Abidjan',
  '+225 27 20 00 00 00', 'contact@velox.ci',
  ST_SetSRID(ST_MakePoint(-4.0197, 5.3204), 4326)::geography, true
)
on conflict (name) do nothing;
commit;`);

// ---- 02 : véhicules ----
const vehLines = [
  "-- 02 — Véhicules (idempotent, upsert sur slug)",
  "begin;",
  `insert into public.vehicles (
  slug, brand, model, title, description, category_id, business_line, status,
  year, price_per_day, sale_price, deposit_amount, transmission, fuel_type, seats,
  mileage, engine, top_speed, acceleration, features, rating, rating_count,
  is_featured, is_published, badge, video_url, cover_image_url, agency_id, last_location
) values`,
];
const vehValues = cars.map((c) => {
  const salePrice = Math.round((c.pricePerDay * 120) / 100) * 100; // prix de vente de démonstration
  return `  (
    ${esc(c.slug)}, ${esc(c.brand)}, ${esc(c.model)}, ${esc(`${c.brand} ${c.model}`)},
    ${esc(c.description)},
    (select id from public.categories where slug = ${esc(c.type)}),
    'both', ${c.available === false ? "'maintenance'" : "'available'"},
    ${num(c.year)}, ${num(c.pricePerDay)}, ${num(salePrice)}, ${num(c.pricePerDay * 2)},
    ${esc(c.transmission)}, ${esc(c.fuelType)}, ${num(c.seats)},
    ${esc(c.mileage)}, ${esc(c.engine)}, ${esc(c.topSpeed)}, ${esc(c.acceleration)},
    ${jsonb(c.features)}, ${num(c.rating)}, 0,
    ${c.isFeatured ? "true" : "false"}, true, ${esc(c.badge ?? null)},
    ${esc(c.video ?? null)}, ${esc(c.image)},
    (select id from public.agencies where name = ${esc(AGENCY)}),
    (select location from public.agencies where name = ${esc(AGENCY)})
  )`;
});
vehLines.push(vehValues.join(",\n"));
vehLines.push(`on conflict (slug) do update set
  brand = excluded.brand, model = excluded.model, title = excluded.title,
  description = excluded.description, category_id = excluded.category_id,
  business_line = excluded.business_line, status = excluded.status,
  year = excluded.year, price_per_day = excluded.price_per_day,
  sale_price = excluded.sale_price, deposit_amount = excluded.deposit_amount,
  transmission = excluded.transmission, fuel_type = excluded.fuel_type,
  seats = excluded.seats, mileage = excluded.mileage, engine = excluded.engine,
  top_speed = excluded.top_speed, acceleration = excluded.acceleration,
  features = excluded.features, rating = excluded.rating,
  is_featured = excluded.is_featured, badge = excluded.badge,
  video_url = excluded.video_url, cover_image_url = excluded.cover_image_url,
  agency_id = excluded.agency_id, last_location = excluded.last_location;
commit;`);

// ---- 03 : médias (dédoublonnés par véhicule) ----
const mediaRows = [];
for (const c of cars) {
  const seen = new Set();
  let order = 0;
  const push = (url, colorName, colorHex) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    const alt = colorName ? `${c.brand} ${c.model} — ${colorName}` : `${c.brand} ${c.model} — couverture`;
    mediaRows.push(`  (${esc(c.slug)}, ${esc(url)}, ${esc(alt)}, 'image', ${t(colorName)}, ${t(colorHex)}, ${order++})`);
  };
  push(c.image, null, null);
  for (const color of c.colors ?? []) {
    for (const url of color.gallery ?? []) push(url, color.name, color.hex ?? null);
  }
}
const mediaHeader = [
  "-- 03 — Médias des véhicules (reconstruit à chaque seed)",
  "begin;",
  "delete from public.vehicle_media;",
  "insert into public.vehicle_media (vehicle_id, url, alt, kind, color_name, color_hex, sort_order)",
  "select v.id, t.url, t.alt, t.kind, t.color_name, t.color_hex, t.sort_order",
  "from (values",
];
const mediaFooter = [
  ") as t(slug, url, alt, kind, color_name, color_hex, sort_order)",
  "join public.vehicles v on v.slug = t.slug;",
  "commit;",
];

// Découpe des médias en fichiers d'au plus ~28 Ko
const mediaChunks = [];
let current = [];
let size = 0;
for (const row of mediaRows) {
  if (size > 28000 && current.length) {
    mediaChunks.push(current);
    current = [];
    size = 0;
  }
  current.push(row);
  size += row.length;
}
if (current.length) mediaChunks.push(current);

const mediaFiles = mediaChunks.map((rows, i) => {
  const suffix = mediaChunks.length === 1 ? "" : String.fromCharCode(97 + i); // 03a, 03b…
  const name = `03_media${suffix}.sql`;
  const body = [
    ...mediaHeader,
    rows.map((r, j) => (j === rows.length - 1 && i === mediaChunks.length - 1 ? r : r + ",")).join("\n"),
    ...(i === mediaChunks.length - 1 ? mediaFooter : [") as t(slug, url, alt, kind, color_name, color_hex, sort_order)", "join public.vehicles v on v.slug = t.slug;", "commit;"]),
  ].join("\n");
  return { name, body };
});
// Corriger les chunks intermédiaires : chaque fichier doit être autonome (begin/commit)
mediaFiles.forEach((f, i) => {
  const rowsPart = f.body.split("from (values")[1].split(") as t")[0];
  const isLast = i === mediaFiles.length - 1;
  f.body = [
    `-- 03${String.fromCharCode(97 + i)} — médias ${i + 1}/${mediaFiles.length}`,
    "begin;",
    ...(i === 0 ? ["delete from public.vehicle_media;"] : []),
    "insert into public.vehicle_media (vehicle_id, url, alt, kind, color_name, color_hex, sort_order)",
    "select v.id, t.url, t.alt, t.kind, t.color_name, t.color_hex, t.sort_order",
    "from (values",
    rowsPart.trimEnd().replace(/,$/, ""),
    ") as t(slug, url, alt, kind, color_name, color_hex, sort_order)",
    "join public.vehicles v on v.slug = t.slug;",
    ...(isLast ? ["commit;"] : ["commit;"]),
  ].join("\n");
});

await writeFile(join(outDir, "01_categories_agencies.sql"), catLines.join("\n") + "\n");
await writeFile(join(outDir, "02_vehicles.sql"), vehLines.join("\n") + "\n");
for (const f of mediaFiles) await writeFile(join(outDir, f.name), f.body + "\n");

const full = [
  "-- seed.sql — concaténation des chunks de supabase/seed/ (idempotent)",
  catLines.join("\n"),
  vehLines.join("\n"),
  ...mediaFiles.map((f) => f.body),
].join("\n\n");
await writeFile(join(root, "supabase", "seed.sql"), full + "\n");

console.log(
  `Seed généré : ${types.length} catégories, 1 agence, ${cars.length} véhicules, ${mediaRows.length} médias, ${mediaFiles.length} chunk(s) média`
);
