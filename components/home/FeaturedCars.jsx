"use client";

import Link from "next/link";
import CarCard from "@/components/cars/CarCard";
import { getFeaturedCars } from "@/lib/utils";
import cars from "@/data/cars";
import SectionHeader from "@/components/ui/SectionHeader";

export default function FeaturedCars() {
  const featured = getFeaturedCars(cars).slice(0, 6);

  return (
    <section className="relative bg-[#050505] overflow-hidden" style={{ paddingTop: "60px", paddingBottom: "140px" }}>

      {/* ── Ambient background atmosphere ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Noise texture for depth */}
      <div className="absolute inset-0 noise pointer-events-none opacity-30" />

      <div
        className="relative z-10"
        style={{
          width: "min(1400px, 92%)",
          margin: "0 auto",
        }}
      >

        {/* ── Section Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">

          <SectionHeader
            eyebrow="Curated Selection"
            heading={
              <span>
                <span>Featured </span>
                <span style={{ color: "#D6B25E" }}>Vehicles</span>
              </span>
            }
            subtext="Handpicked from our premium fleet — each car a statement in its own right."
            align="left"
            light={true}
            className="max-w-2xl"
          />

          {/* Right: CTA button */}
          <Link
            href="/cars"
            className="group inline-flex items-center gap-3 font-body uppercase transition-all duration-400 shrink-0 self-start lg:self-auto"
            style={{
              padding: "16px 32px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #E0BE6F, #B68A2F)",
              color: "black",
              fontWeight: "700",
              letterSpacing: "1px",
              boxShadow: "0 10px 30px rgba(214,178,94,0.2)",
              fontSize: "12px",
              textDecoration: "none"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 18px 40px rgba(214,178,94,0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(214,178,94,0.2)";
            }}
          >
            View All Cars
            <svg
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* ── Vehicle Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "38px",
            marginTop: "70px"
          }}
        >
          {featured.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>

        {/* ── Bottom divider ── */}
        <div
          className="w-full h-px mt-24"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />
      </div>
    </section>
  );
}
