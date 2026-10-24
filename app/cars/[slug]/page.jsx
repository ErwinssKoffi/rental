import { notFound } from "next/navigation";
import cars from "@/data/cars";
import CarClientView from "@/components/cars/CarClientView";

// Generate static routes at build time
export function generateStaticParams() {
  return cars.map((car) => ({
    slug: car.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) return { title: "Vehicle Not Found | Velox Rentals" };
  
  return {
    title: `${car.brand} ${car.model} Rental | Velox Rentals`,
    description: car.description,
    openGraph: {
      title: `${car.brand} ${car.model} | Velox Luxury Rentals`,
      description: car.description,
      images: [{ url: car.image }],
    }
  };
}

export default async function CarDetailPage({ params }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);

  if (!car) {
    notFound();
  }

  // Schema.org structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": `${car.brand} ${car.model}`,
    "brand": {
      "@type": "Brand",
      "name": car.brand
    },
    "model": car.model,
    "image": car.gallery || [car.image],
    "description": car.description,
    "vehicleEngine": {
      "@type": "EngineSpecification",
      "engineType": car.engine
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "AED",
      "price": car.pricePerDay,
      "availability": car.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://veloxrentals.com/cars/${car.slug}`
    }
  };

  const relatedCars = cars
    .filter(c => c.type === car.type && c.id !== car.id)
    .slice(0, 3);

  // Fallback gallery if script didn't run or missing
  const gallery = car.gallery || [car.image, car.image, car.image];
  const performance = car.performance || { speed: 85, comfort: 90, luxury: 88, economy: 70 };
  const reviews = car.reviews || [];

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <CarClientView car={car} relatedCars={relatedCars} />
    </main>
  );
}
