"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="relative py-[180px] bg-[#050505] overflow-hidden flex items-center justify-center text-center">
      
      {/* Background Cinematic Glow */}
      <div className="absolute inset-0 bg-[url('/images/default-car.jpg')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/[0.08] blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <span className="font-body text-[#D4AF37] uppercase tracking-[6px] text-base font-semibold mb-8 block" style={{ marginTop: '40px' }}>
            Elevate Your Journey
          </span>
          <h2 className="font-display text-white text-[32px] md:text-[54px] leading-[1.08] font-bold" style={{ marginBottom: '20px' }}>
            Experience Luxury <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D76B]">Without Compromise</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6" style={{ marginBottom: '150px' }}>
            <Link 
              href="/cars"
              className="w-full sm:w-auto h-[48px] px-10 flex items-center justify-center gap-3 bg-gradient-to-br from-[#D4AF37] to-[#F4D76B] rounded-[14px] text-[#050505] font-body font-bold text-[14px] uppercase tracking-[2px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)]"
            >
              Reserve Your Vehicle
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
