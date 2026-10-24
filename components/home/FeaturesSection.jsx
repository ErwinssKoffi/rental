"use client";

const features = [
  {
    id: 1,
    title: "100% Secure",
    description: "Your data is always protected",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "24/7 Support",
    description: "We're always here to help",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Best Prices",
    description: "Guaranteed competitive rates",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Free Cancellation",
    description: "Up to 24 hours before pickup",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const GOLD = "#D4AF37";

export default function FeaturesSection() {
  return (
    <section
      style={{
        background: "#070707",
        padding: "0 0 80px 0",
        position: "relative",
      }}
    >
      {/* ── Centered container ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "clamp(24px, 4vw, 64px)",
          paddingRight: "clamp(24px, 4vw, 64px)",
        }}
      >
        {/* Divider from FeaturedCars above */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            marginBottom: "60px",
          }}
        />

        {/* 4-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
          className="features-grid"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "32px 24px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.02)",
                transition: "all 0.4s ease",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
                e.currentTarget.style.background = "rgba(212,175,55,0.025)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Gold icon container */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(212,175,55,0.07)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: GOLD,
                  marginBottom: "16px",
                  transition: "all 0.4s ease",
                }}
              >
                {feature.icon}
              </div>

              <h3
                className="font-display font-semibold"
                style={{ fontSize: "14px", color: "#ffffff", marginBottom: "6px" }}
              >
                {feature.title}
              </h3>
              <p
                className="font-body font-light"
                style={{ fontSize: "12px", color: "rgba(232,232,232,0.4)", lineHeight: "1.6" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
