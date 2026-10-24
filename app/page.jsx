import HeroSection from "@/components/home/HeroSection";
import FeaturedCars from "@/components/home/FeaturedCars";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import FleetCategories from "@/components/home/FleetCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTABanner from "@/components/home/CTABanner";
import { getFeaturedVehicles } from "@/lib/server/vehicles-repo";

export const revalidate = 60;

export const metadata = {
  title: "Velox Rentals | Vente & location de véhicules premium",
  description:
    "Louez à la journée ou achetez votre prochain véhicule : sportives, SUV et berlines de luxe chez Velox Rentals.",
};

export default async function Home() {
  const featured = await getFeaturedVehicles(6);

  return (
    <main>
      <HeroSection />
      <FeaturedCars cars={featured} />
      <FeaturesSection />
      <HowItWorks />
      <FleetCategories />
      <WhyChooseUs />
      <CTABanner />
    </main>
  );
}
