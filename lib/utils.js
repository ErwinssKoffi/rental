export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function getCarsByType(cars, type) {
  if (!type || type === "all") return cars;
  return cars.filter((car) => car.type === type);
}

export function getFeaturedCars(cars) {
  return cars.filter((car) => car.isFeatured);
}

export function getCarBySlug(cars, slug) {
  return cars.find((car) => car.slug === slug) || null;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const CAR_TYPES = [
  { value: "all", label: "All Types" },
  { value: "economy", label: "Economy" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
  { value: "sports", label: "Sports" },
];

export const TRANSMISSIONS = [
  { value: "all", label: "All" },
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
];

export const FUEL_TYPES = [
  { value: "all", label: "All" },
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
];

export const TYPE_COLORS = {
  economy: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  suv: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  luxury: { bg: "bg-gold/10", text: "text-gold-500", border: "border-gold/20" },
  sports: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
};

export const TYPE_LABELS = {
  economy: "Economy",
  suv: "SUV",
  luxury: "Luxury",
  sports: "Sports",
};
