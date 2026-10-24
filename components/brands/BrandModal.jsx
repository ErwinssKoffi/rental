"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Flag, Star, Settings, DollarSign, Gauge } from "lucide-react";
import Link from "next/link";

export default function BrandModal({ brand, isOpen, onClose }) {
  if (!brand) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-[#050505]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl mx-auto my-8 md:my-14 rounded-[32px] border border-white/[0.08] bg-[#0A0A0A] px-8 md:px-16 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden pointer-events-auto"
              style={{ paddingTop: "64px", paddingBottom: "64px" }}
            >
              {/* Internal Glow */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/[0.05] blur-[100px] rounded-full pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                {/* Brand Header */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-[80px] h-[80px] rounded-[20px] bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-white/[0.08] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <span className="font-display text-[#D4AF37] text-[36px] font-bold">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-body text-[#D4AF37] uppercase tracking-[4px] text-xs font-semibold mb-1 block">
                      {brand.country}
                    </span>
                    <h2 className="font-display text-white text-[32px] md:text-[40px] font-bold leading-tight">
                      {brand.name}
                    </h2>
                  </div>
                </div>

                {/* Brand Story */}
                <div className="mb-10">
                  <p className="font-body text-white/80 text-[18px] leading-[1.7] font-light">
                    {brand.story}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar size={18} className="text-[#D4AF37]" />
                      <span className="font-body text-white/50 text-[12px] uppercase tracking-[1px]">Founded</span>
                    </div>
                    <span className="font-display text-white text-[20px] font-semibold">{brand.founded}</span>
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Star size={18} className="text-[#D4AF37]" />
                      <span className="font-body text-white/50 text-[12px] uppercase tracking-[1px]">Class</span>
                    </div>
                    <span className="font-display text-white text-[20px] font-semibold">{brand.class}</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings size={18} className="text-[#D4AF37]" />
                      <span className="font-body text-white/50 text-[12px] uppercase tracking-[1px]">Specialty</span>
                    </div>
                    <span className="font-display text-white text-[20px] font-semibold">{brand.specialty}</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Gauge size={18} className="text-[#D4AF37]" />
                      <span className="font-body text-white/50 text-[12px] uppercase tracking-[1px]">Horsepower</span>
                    </div>
                    <span className="font-display text-white text-[20px] font-semibold">{brand.hpRange}</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Flag size={18} className="text-[#D4AF37]" />
                      <span className="font-body text-white/50 text-[12px] uppercase tracking-[1px]">Available</span>
                    </div>
                    <span className="font-display text-white text-[20px] font-semibold">{brand.availableCars} Models</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign size={18} className="text-[#D4AF37]" />
                      <span className="font-body text-white/50 text-[12px] uppercase tracking-[1px]">Price/Day</span>
                    </div>
                    <span className="font-display text-white text-[20px] font-semibold">{brand.priceRange}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex justify-end">
                  <Link 
                    href="/cars"
                    onClick={onClose}
                    className="h-[48px] px-8 bg-gradient-to-br from-[#D4AF37] to-[#F4D76B] rounded-[14px] text-[#050505] font-body font-bold text-[14px] uppercase tracking-[2px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)] flex items-center justify-center"
                  >
                    Explore {brand.name} Fleet
                  </Link>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
