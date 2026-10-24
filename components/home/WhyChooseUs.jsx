"use client";

import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";

const benefits = [
  {
    title: "All-Inclusive Insurance",
    description: "Every rental includes premium comprehensive coverage. No hidden fees, no deductible surprises.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "White-Glove Delivery",
    description: "We deliver your vehicle to your home, hotel, or airport arrivals terminal.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Pristine Condition",
    description: "Every vehicle is deep-cleaned and undergoes a 40-point inspection before every handover.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: "24/7 Concierge",
    description: "Your dedicated concierge is available around the clock for route planning and roadside help.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

const GOLD = "#D4AF37";

export default function WhyChooseUs() {
  return (
    <section
      style={{
        background: "#080808",
        padding: "140px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Top edge */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.12), transparent)",
        }}
      />

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
        {/* ── 2-column grid: Image | Content ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(48px, 6vw, 96px)",
            alignItems: "center",
          }}
          className="why-grid"
        >

          {/* ── LEFT: Cinematic Image ── */}
          <div style={{ position: "relative" }}>
            {/* Main image */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "600px",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&q=90"
                alt="Premium car interior — Velox experience"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Cinematic gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.1) 50%, transparent 100%)",
                }}
              />
              {/* Gold rim */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "28px",
                  border: "1px solid rgba(212,175,55,0.12)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Floating 5-star badge */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "-20px",
                background: "rgba(10,10,10,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "20px 24px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                minWidth: "200px",
              }}
            >
              <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} style={{ width: "14px", height: "14px", color: GOLD }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p
                className="font-display font-bold"
                style={{ fontSize: "15px", color: "#ffffff", marginBottom: "4px" }}
              >
                5.0 / 5 Rating
              </p>
              <p
                className="font-body"
                style={{ fontSize: "11px", color: "rgba(232,232,232,0.5)", lineHeight: "1.5" }}
              >
                Based on 2,000+ client reviews on Trustpilot.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Content ── */}
          <div>
            <SectionHeader
              eyebrow="The Velox Difference"
              heading={
                <span>
                  <span>Beyond Just </span>
                  <span className="text-gold-gradient">Renting</span>
                </span>
              }
              subtext="We don't just hand over the keys — we curate an experience. From booking to drop-off, expect nothing less than perfection."
              align="left"
              light={true}
              className="mb-48"
            />

            {/* ── 2×2 Benefits grid ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "28px",
              }}
            >
              {benefits.map((b) => (
                <BenefitItem key={b.title} benefit={b} />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile responsive style */}
      <style>{`
        @media (max-width: 900px) {
          .why-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function BenefitItem({ benefit }) {
  return (
    <div
      className="group"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.02)",
        transition: "all 0.35s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)";
        e.currentTarget.style.background = "rgba(212,175,55,0.03)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: "rgba(212,175,55,0.08)",
          border: "1px solid rgba(212,175,55,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: GOLD,
          flexShrink: 0,
        }}
      >
        {benefit.icon}
      </div>

      {/* Text */}
      <div>
        <h3
          className="font-display font-semibold"
          style={{ fontSize: "13px", color: "#ffffff", marginBottom: "6px" }}
        >
          {benefit.title}
        </h3>
        <p
          className="font-body font-light"
          style={{ fontSize: "12px", color: "rgba(232,232,232,0.45)", lineHeight: "1.7" }}
        >
          {benefit.description}
        </p>
      </div>
    </div>
  );
}
