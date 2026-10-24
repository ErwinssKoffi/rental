"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function BrandsCTA() {
  return (
    <section className="relative pt-[140px] pb-[180px] bg-[#050505] overflow-hidden flex items-center justify-center text-center">
      
      {/* Background Cinematic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/[0.05] blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <span className="font-body text-[#D4AF37] uppercase tracking-[4px] text-[13px] font-semibold mb-6 block">
            Begin Your Journey
          </span>
          <h2 className="font-display text-white text-[40px] md:text-[52px] leading-[1.15] font-bold mb-4">
            Ready to Experience Luxury?
          </h2>
          <p className="font-body text-white/70 text-[18px] leading-[1.8] mb-10">
            Reserve Your Dream Vehicle Today
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6" style={{ marginTop: '40px', marginBottom: '80px' }}>
            <Link 
              href="/cars"
              className="w-full sm:w-auto h-[48px] px-8 flex items-center justify-center bg-gradient-to-br from-[#D4AF37] to-[#F4D76B] rounded-[14px] text-[#050505] font-body font-bold text-[14px] uppercase tracking-[2px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)]"
            >
              Explore Fleet
            </Link>
            
            <Link 
              href="mailto:vip@veloxrentals.com"
              className="w-full sm:w-auto group h-[48px] px-8 flex items-center justify-center bg-transparent border border-white/20 rounded-[14px] text-white font-body font-bold text-[14px] uppercase tracking-[2px] transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-1 hover:border-[#D4AF37]/50"
            >
              <span className="flex items-center gap-3">
                <Phone size={16} className="text-[#D4AF37]" />
                Contact Concierge
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
