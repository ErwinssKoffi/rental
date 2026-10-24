"use client";

import { motion } from "framer-motion";

export default function BrandExperience() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-[120px]">
      
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(to top, #050505 0%, rgba(5,5,5,0.7) 50%, #050505 100%),
            url('/images/default-car.jpg')
          `
        }}
      />
      
      {/* Ambient Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.07] blur-[150px] rounded-full pointer-events-none z-10" />

      <div className="relative z-20 max-w-[1000px] mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-body text-[#D4AF37] uppercase tracking-[6px] text-[13px] font-semibold mb-8 block">
            The Velox Commitment
          </span>
          <h2 className="font-display text-white text-[36px] md:text-[50px] lg:text-[64px] leading-[1.2] font-bold drop-shadow-2xl">
            Every vehicle in our collection is selected to deliver{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D76B]">uncompromising luxury</span>, 
            prestige, and performance.
          </h2>
        </motion.div>
      </div>
      
    </section>
  );
}
