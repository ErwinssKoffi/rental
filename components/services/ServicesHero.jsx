"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";

export default function ServicesHero() {
  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-start overflow-hidden pt-[80px]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/services-hero.png"
          alt="Velox Luxury Services"
          fill
          priority
          className="object-cover scale-105"
          quality={100}
        />
        
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10" />
        
        {/* Ambient Gold Glow */}
        <div className="absolute left-0 top-1/4 w-[800px] h-[800px] bg-[#D4AF37]/[0.08] blur-[150px] rounded-full pointer-events-none z-10" />
      </div>

      <div className="relative z-20 mx-auto w-full px-6 pt-[40px] max-w-4xl text-center flex flex-col items-center">
        <div className="max-w-3xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            <span className="font-body text-[#D4AF37] uppercase tracking-[5px] text-sm md:text-base font-semibold mb-6 block">
              Redefining Mobility
            </span>
            <h1 className="font-display text-white text-[50px] md:text-[78px] leading-[1.05] font-bold mb-0 max-w-[800px] drop-shadow-2xl">
              Luxury Services <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D76B]">Designed Around You</span>
            </h1>
            <p className="font-body text-white/78 text-[20px] leading-[1.7] mt-[24px] mb-12 max-w-[600px] mx-auto font-light tracking-wide" style={{ marginBottom: '80px' }}>
              From executive transportation to unforgettable driving experiences, 
              Velox delivers comfort, prestige, and seamless mobility tailored to your lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Primary CTA */}
              <Link 
                href="/cars"
                className="group relative h-[48px] flex items-center justify-center px-6 bg-gradient-to-br from-[#D4AF37] to-[#F4D76B] rounded-[14px] text-[#050505] font-body font-bold text-[14px] uppercase tracking-[2px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explore Fleet
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              {/* Secondary CTA */}
              <Link
                href="mailto:vip@veloxrentals.com"
                className="group relative h-[48px] flex items-center justify-center px-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-[14px] text-white font-body font-semibold text-[14px] uppercase tracking-[2px] transition-all duration-300 hover:bg-white/[0.08] hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              >
                <span className="flex items-center gap-3">
                  <Phone size={16} className="text-[#D4AF37]" />
                  Contact Concierge
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="font-body text-[#D4AF37] uppercase tracking-[3px] text-xs">Discover</span>
        <div className="w-[1px] h-[60px] bg-white/20 overflow-hidden relative">
          <motion.div 
            animate={{ top: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1/2 bg-[#D4AF37]" 
          />
        </div>
      </motion.div>
    </section>
  );
}
