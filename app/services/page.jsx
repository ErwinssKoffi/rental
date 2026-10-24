import ServicesHero from "@/components/services/ServicesHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import WhyChooseUs from "@/components/services/WhyChooseUs";
import VipExperience from "@/components/services/VipExperience";
import Testimonials from "@/components/services/Testimonials";
import FAQ from "@/components/services/FAQ";
import ServicesCTA from "@/components/services/ServicesCTA";

export const metadata = {
  title: "Luxury Services | Velox Premium Rentals",
  description: "Experience world-class luxury mobility with Velox. Chauffeur services, airport transfers, VIP experiences, and more.",
};

export default function ServicesPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white overflow-hidden">
      <ServicesHero />
      <ServicesGrid />
      <WhyChooseUs />
      <VipExperience />
      <Testimonials />
      <FAQ />
      <ServicesCTA />
    </main>
  );
}
