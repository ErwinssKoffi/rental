"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export default function AboutTestimonials() {
  return (
    <section className="relative w-full py-[140px] bg-[#050505] overflow-hidden">
      
      {/* Background Cinematic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/[0.05] blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center w-full"
        >
          <Quote size={48} className="text-[#D4AF37]/40 mb-[40px]" />
          
          <h3 className="font-display text-white text-[24px] md:text-[32px] leading-[1.4] font-light mb-[120px] max-w-[800px] mx-auto text-center italic">
            "The most seamless luxury rental experience in London. Their attention to detail and concierge support is unmatched."
          </h3>
          
          <div className="flex gap-2 mb-[40px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={22} className="text-[#D4AF37] fill-[#D4AF37]" />
            ))}
          </div>

          <div className="flex flex-col items-center">
            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#111111] to-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <span className="font-display text-[#D4AF37] font-bold text-[18px]">MA</span>
            </div>
            <div className="text-center">
              <span className="font-display text-white text-[24px] font-bold block mb-1">Michael Anderson</span>
              <span className="font-body text-[#D4AF37] text-[15px] uppercase tracking-[3px] font-semibold">Executive Client</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
