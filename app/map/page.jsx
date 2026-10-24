import LiveFleetMap from "@/components/map/LiveFleetMap";

export const metadata = {
  title: "Carte de la flotte en direct | Velox Rentals",
  description:
    "Suivez en temps réel la position des véhicules Velox Rentals à Abidjan sur une carte OpenStreetMap.",
};

export default function FleetMapPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
        <p className="eyebrow">Géolocalisation</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-3">
          La flotte <span style={{ color: "#D4AF37" }}>en direct</span>
        </h1>
        <p className="text-white/55 font-body text-lg mt-4 max-w-2xl">
          Position exacte de chaque véhicule, mise à jour instantanément grâce
          aux trackers GPS et à la diffusion temps réel Supabase. Cliquez sur un
          marqueur pour voir la vitesse, l&apos;état du moteur et la dernière
          transmission.
        </p>

        <div className="mt-10">
          <LiveFleetMap height={640} />
        </div>

        <div className="flex flex-wrap gap-6 mt-8 text-sm font-body text-white/55">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
            Disponible
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            En location
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
            Maintenance
          </span>
        </div>
      </section>
    </main>
  );
}
