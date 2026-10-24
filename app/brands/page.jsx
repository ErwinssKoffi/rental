import BrandsHero from "@/components/brands/BrandsHero";
import BrandsGrid from "@/components/brands/BrandsGrid";
import BrandsStatistics from "@/components/brands/BrandsStatistics";
import BrandExperience from "@/components/brands/BrandExperience";
import BrandsCTA from "@/components/brands/BrandsCTA";

export const metadata = {
  title: "Premium Brands | Velox Rentals",
  description: "Experience the world's most prestigious automotive brands. Discover our curated fleet of luxury and performance vehicles.",
};

export default function BrandsPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white overflow-hidden">
      <BrandsHero />
      <BrandsGrid />
      <BrandsStatistics />
      <BrandExperience />
      <BrandsCTA />
    </main>
  );
}
