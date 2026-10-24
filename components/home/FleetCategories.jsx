import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const categories = [
  {
    type: "economy",
    label: "Economy",
    tagline: "Smart & Efficient",
    description: "Practical, fuel-efficient vehicles for city driving and everyday use.",
    count: 2,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=85",
    accent: "from-blue-600/60",
    badge: "From $89/day",
  },
  {
    type: "suv",
    label: "SUV",
    tagline: "Space & Command",
    description: "Commanding SUVs that conquer any terrain while carrying the whole family.",
    count: 3,
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=85",
    accent: "from-emerald-600/60",
    badge: "From $195/day",
  },
  {
    type: "luxury",
    label: "Luxury",
    tagline: "Refined Excellence",
    description: "Hand-crafted interiors, silent cabins, and presence that commands attention.",
    count: 5,
    image: "https://images.unsplash.com/photo-1563694983011-6f4d90358083?w=800&q=85",
    accent: "from-yellow-600/60",
    badge: "From $280/day",
  },
  {
    type: "sports",
    label: "Sports",
    tagline: "Pure Performance",
    description: "Track-bred machines that blur the line between road car and racing legend.",
    count: 3,
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=85",
    accent: "from-red-600/60",
    badge: "From $220/day",
  },
];

export default function FleetCategories() {
  return (
    <section
      style={{ background: "#070707", padding: "120px 0", position: "relative", overflow: "hidden" }}
    >
      {/* Top edge line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)" }} />

      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "clamp(24px, 4vw, 64px)",
          paddingRight: "clamp(24px, 4vw, 64px)",
        }}
      >
        {/* ── Centered section header ── */}
        <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 56px auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "28px", height: "1px", background: "linear-gradient(90deg, transparent, #D4AF37)" }} />
            <span className="font-body font-semibold uppercase" style={{ fontSize: "10px", color: "#D4AF37", letterSpacing: "0.35em" }}>
              Our Fleet
            </span>
            <div style={{ width: "28px", height: "1px", background: "linear-gradient(90deg, #D4AF37, transparent)" }} />
          </div>
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", lineHeight: "1.1", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "16px" }}>
            Find Your{" "}
            <span className="text-gold-gradient">Category</span>
          </h2>
          <p className="font-body font-light" style={{ fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: "1.8", color: "rgba(232,232,232,0.5)" }}>
            Every occasion deserves the right car. Explore our four fleet segments to find your perfect drive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.type}
              href={`/cars?type=${cat.type}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] block border border-white/6 hover:border-gold/25 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1"
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} via-black/40 to-black/10 group-hover:opacity-90 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Count badge */}
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-xs font-body font-semibold text-platinum-300">
                {cat.count} cars
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-gold/80 mb-1">
                  {cat.tagline}
                </p>
                <h3 className="font-display font-black text-2xl text-white mb-2 group-hover:text-gold transition-colors duration-300">
                  {cat.label}
                </h3>
                <p className="text-xs font-body text-platinum-400 leading-relaxed mb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body font-semibold text-gold">{cat.badge}</span>
                  <span className="flex items-center gap-1 text-xs font-body text-white group-hover:text-gold transition-colors">
                    Explore
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
