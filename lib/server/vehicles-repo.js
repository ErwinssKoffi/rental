// Accès serveur aux véhicules (Supabase Postgres).
// En cas d'injoignabilité réseau (aperçu sandbox), un repli sur le catalogue
// statique local est possible si SUPABASE_DATA_FALLBACK=1.
import { getAnonClient } from "@/lib/supabase/public";
import localCars from "@/data/cars";
import { CAR_TYPES } from "@/lib/utils";

const FALLBACK_ENABLED = process.env.SUPABASE_DATA_FALLBACK === "1";

// Convertit une ligne Postgres (avec médias et catégorie liées)
// vers la forme attendue par les composants du catalogue.
function normalizeVehicle(row) {
  const media = Array.isArray(row.media) ? row.media : [];
  const cover =
    row.cover_image_url ??
    media.find((m) => m.sort_order === 0)?.url ??
    media[0]?.url ??
    null;

  const colorMap = new Map();
  for (const m of media) {
    if (!m.color_name) continue;
    if (!colorMap.has(m.color_name)) {
      colorMap.set(m.color_name, {
        name: m.color_name,
        hex: m.color_hex,
        filter: "none",
        gallery: [],
      });
    }
    colorMap.get(m.color_name).gallery.push(m.url);
  }
  const colors = [...colorMap.values()];
  const gallery = [...new Set(media.map((m) => m.url))];

  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    type: row.category?.slug ?? "economy",
    categoryName: row.category?.name ?? null,
    businessLine: row.business_line ?? "both",
    status: row.status,
    pricePerDay: row.price_per_day != null ? Number(row.price_per_day) : null,
    salePrice: row.sale_price != null ? Number(row.sale_price) : null,
    depositAmount:
      row.deposit_amount != null ? Number(row.deposit_amount) : null,
    transmission: row.transmission ?? "automatic",
    fuelType: row.fuel_type ?? "petrol",
    seats: row.seats ?? 4,
    year: row.year,
    mileage: row.mileage,
    engine: row.engine,
    topSpeed: row.top_speed,
    acceleration: row.acceleration,
    description: row.description ?? "",
    features: Array.isArray(row.features) ? row.features : [],
    image: cover,
    gallery,
    video: row.video_url,
    isFeatured: !!row.is_featured,
    available: row.status === "available" || row.status === "reserved",
    badge: row.badge,
    rating: row.rating != null ? Number(row.rating) : 4.5,
    colors,
  };
}

// Ajoute au catalogue statique les champs spécifiques à la nouvelle plateforme.
function normalizeLocalCar(car) {
  const salePrice = Math.round((car.pricePerDay * 120) / 100) * 100;
  return {
    ...car,
    businessLine: "both",
    salePrice,
    depositAmount: car.pricePerDay * 2,
    status: car.available === false ? "maintenance" : "available",
    gallery:
      car.gallery ??
      [car.image, ...(car.colors ?? []).flatMap((c) => c.gallery)].filter(
        Boolean
      ),
  };
}

async function fetchVehicles() {
  const supabase = getAnonClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(
      "*, category:categories(slug, name), media:vehicle_media(url, alt, kind, color_name, color_hex, sort_order)"
    )
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(normalizeVehicle);
}

export async function getAllVehicles() {
  try {
    return await fetchVehicles();
  } catch (error) {
    if (!FALLBACK_ENABLED) throw error;
    console.warn(
      "[vehicles-repo] Supabase injoignable, repli catalogue local :",
      error?.message ?? error
    );
    return localCars.map(normalizeLocalCar);
  }
}

export async function getFeaturedVehicles(limit = 6) {
  const vehicles = await getAllVehicles();
  return vehicles.filter((c) => c.isFeatured).slice(0, limit);
}

export async function getVehicleBySlug(slug) {
  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select(
        "*, category:categories(slug, name), media:vehicle_media(url, alt, kind, color_name, color_hex, sort_order)"
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data ? normalizeVehicle(data) : null;
  } catch (error) {
    if (!FALLBACK_ENABLED) throw error;
    const local = localCars.find((c) => c.slug === slug);
    return local ? normalizeLocalCar(local) : null;
  }
}

export async function getCategories() {
  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug, name, description, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((c) => ({
      value: c.slug,
      label: c.name,
      description: c.description,
    }));
  } catch (error) {
    if (!FALLBACK_ENABLED) throw error;
    return CAR_TYPES.filter((t) => t.value !== "all");
  }
}
