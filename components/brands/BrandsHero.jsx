"use client";

import { motion } from "framer-motion";

export default function BrandsHero() {
  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-start overflow-hidden pt-[80px]">
      {/* Background Image & Gradient */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 100%),
            url('/images/brands-hero.png')
          `
        }}
      />
      
      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505] z-10" />
      
      {/* Ambient Gold Glow */}
      <div className="absolute left-0 top-1/4 w-[800px] h-[800px] bg-[#D4AF37]/[0.06] blur-[150px] rounded-full pointer-events-none z-10" />

      <div className="relative z-20 mx-auto w-full px-6 pt-[40px] max-w-4xl text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <span className="font-body text-[#D4AF37] uppercase tracking-[5px] text-sm md:text-base font-semibold mb-6 block">
            The Elite Collection
          </span>
          <h1 className="font-display text-white text-[50px] md:text-[78px] leading-[1.05] font-bold mb-0 max-w-[800px] drop-shadow-2xl">
            Experience The World's Most <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D76B]">Prestigious Brands</span>
          </h1>
          <p className="font-body text-white/78 text-[20px] leading-[1.7] mt-[24px] max-w-[600px] mx-auto font-light tracking-wide">
            From timeless elegance to cutting-edge performance, 
            discover a curated fleet of premium vehicles engineered for perfection.
          </p>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="font-body text-[#D4AF37] uppercase tracking-[3px] text-xs">Explore</span>
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
