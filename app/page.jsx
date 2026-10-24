import HeroSection from "@/components/home/HeroSection";
import FeaturedCars from "@/components/home/FeaturedCars";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import FleetCategories from "@/components/home/FleetCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTABanner from "@/components/home/CTABanner";

export const metadata = {
  title: "Velox Rentals | Premium Car Rental & Chauffeur Services",
  description: "Experience the ultimate in automotive luxury. Rent premium sports cars, SUVs, and luxury sedans with Velox Rentals.",
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedCars />
      <FeaturesSection />
      <HowItWorks />
      <FleetCategories />
      <WhyChooseUs />
      <CTABanner />
    </main>
  );
}

