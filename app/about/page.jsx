import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import LuxuryExperience from "@/components/about/LuxuryExperience";
import MeetTheTeam from "@/components/about/MeetTheTeam";
import Timeline from "@/components/about/Timeline";
import AboutTestimonials from "@/components/about/AboutTestimonials";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata = {
  title: "About Us | Velox Premium Rentals",
  description: "Learn about the history, team, and uncompromising standards behind Velox's luxury mobility experience.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white overflow-hidden">
      <AboutHero />
      <CompanyStory />
      <LuxuryExperience />
      <MeetTheTeam />
      <Timeline />
      <AboutTestimonials />
      <AboutCTA />
    </main>
  );
}
