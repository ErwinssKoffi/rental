import { notFound } from "next/navigation";
import CarClientView from "@/components/cars/CarClientView";
import { getAllVehicles, getVehicleBySlug } from "@/lib/server/vehicles-repo";

// ISR : régénération périodique + revalidation à la demande (éditions admin)
export const revalidate = 60;

export async function generateStaticParams() {
  const vehicles = await getAllVehicles();
  return vehicles.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await getVehicleBySlug(slug);
  if (!car) return { title: "Véhicule introuvable | Velox Rentals" };

  return {
    title: `${car.brand} ${car.model} | Velox Rentals`,
    description: car.description,
    openGraph: {
      title: `${car.brand} ${car.model} | Velox Rentals`,
      description: car.description,
      images: [{ url: car.image }],
    },
  };
}

export default async function CarDetailPage({ params }) {
  const { slug } = await params;
  const car = await getVehicleBySlug(slug);

  if (!car) {
    notFound();
  }

  const allVehicles = await getAllVehicles();
  const relatedCars = allVehicles
    .filter((c) => c.type === car.type && c.id !== car.id)
    .slice(0, 3);

  // Données structurées Schema.org (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${car.brand} ${car.model}`,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    image: car.gallery?.length ? car.gallery : [car.image],
    description: car.description,
    vehicleEngine: { "@type": "EngineSpecification", engineType: car.engine },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: car.pricePerDay,
      availability: car.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://veloxrentals.com/cars/${car.slug}`,
    },
  };

  const gallery = car.gallery?.length ? car.gallery : [car.image, car.image, car.image];
  const performance = car.performance || {
    speed: 85,
    comfort: 90,
    luxury: 88,
    economy: 70,
  };
  const reviews = car.reviews || [];

  return (
    <main className="min-h-screen bg-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CarClientView
        car={{ ...car, gallery, performance, reviews }}
        relatedCars={relatedCars}
      />
    </main>
  );
}
