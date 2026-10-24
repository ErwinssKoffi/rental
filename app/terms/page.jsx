"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <main 
      className="relative min-h-screen flex items-start justify-center overflow-hidden bg-[#050505] pb-20"
      style={{ paddingTop: "150px" }}
    >

      {/* ── Ambient background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gold glows for luxury depth */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c9a84c]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#c9a84c]/3 rounded-full blur-[100px]" />
        {/* Top and bottom edge fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* ── Grid pattern ── */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* ── Content container ── */}
      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col items-center gap-12"
        >
          {/* Header Block */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3">
              <div className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #c9a84c)" }} />
              <span className="text-[10px] font-body font-semibold tracking-[0.35em] uppercase text-[#c9a84c]">
                Legal Framework
              </span>
              <div className="w-8 h-px" style={{ background: "linear-gradient(90deg, #c9a84c, transparent)" }} />
            </div>

            <h1
              className="font-display font-bold text-white tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: "1.1" }}
            >
              Terms & &nbsp;
              <span className="text-transparent bg-clip-text" style={{
                backgroundImage: "linear-gradient(135deg, #c9a84c 0%, #e9c15f 50%, #b08a2e 100%)",
              }}>Conditions</span>
            </h1>

            <p className="font-body font-normal text-white/50 max-w-[600px] mx-auto text-sm leading-relaxed tracking-wide" style={{ marginTop: "40px" }}>
              We provide the most transparent and fair service. Please review the detailed information about rental agreements, liabilities, and rules below.
            </p>
          </div>

          {/* ── Details Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">

            {/* Card 1: Rental Agreement */}
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 p-12 rounded-[28px] flex flex-col items-center text-center gap-5 min-h-[260px] justify-center transition-all duration-500 hover:border-[#c9a84c]/30 hover:bg-white/[0.04]">
              <div className="text-[#c9a84c] text-2xl font-bold font-display tracking-tight">01. Agreement</div>
              <p className="text-white/70 text-[14px] font-normal font-body leading-relaxed max-w-[240px] tracking-wide">
                Drivers must be at least 21 with a valid license. A security deposit hold is required on a credit card.
              </p>
            </div>

            {/* Card 2: Liabilities */}
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 p-12 rounded-[28px] flex flex-col items-center text-center gap-5 min-h-[260px] justify-center transition-all duration-500 hover:border-[#c9a84c]/30 hover:bg-white/[0.04]">
              <div className="text-[#c9a84c] text-2xl font-bold font-display tracking-tight">02. Liability</div>
              <p className="text-white/70 text-[14px] font-normal font-body leading-relaxed max-w-[240px] tracking-wide">
                The hirer is responsible for all traffic fines and toll charges incurred during the rental period.
              </p>
            </div>

            {/* Card 3: Usage Rules */}
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 p-12 rounded-[28px] flex flex-col items-center text-center gap-5 min-h-[260px] justify-center transition-all duration-500 hover:border-[#c9a84c]/30 hover:bg-white/[0.04]">
              <div className="text-[#c9a84c] text-2xl font-bold font-display tracking-tight">03. Rules</div>
              <p className="text-white/70 text-[14px] font-normal font-body leading-relaxed max-w-[240px] tracking-wide">
                Strictly no smoking or off-roading. Vehicles must be returned with the same fuel level as provided.
              </p>
            </div>

          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-white/10 my-4" />

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center justify-center font-body font-bold uppercase rounded-full transition-all duration-[400ms] hover:-translate-y-[3px]"
            style={{
              padding: "14px 36px",
              fontSize: "13px",
              letterSpacing: "0.2em",
              color: "#050505",
              background: "linear-gradient(135deg, #c9a84c, #e9c15f)",
              boxShadow: "0 8px 25px rgba(201,168,76,0.25)",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 15px 35px rgba(201,168,76,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 25px rgba(201,168,76,0.25)"; }}
          >
            Back to Home
          </Link>

        </motion.div>
      </div>

    </main>
  );
}
