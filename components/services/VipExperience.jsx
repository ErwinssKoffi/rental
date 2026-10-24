"use client";

import { motion } from "framer-motion";

export default function VipExperience() {
  return (
    <section className="relative py-[160px] w-full flex items-center justify-center overflow-hidden">
      
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {/* We use another video or a high-quality image. Using a video for ultimate luxury feel */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full scale-[1.02] opacity-40"
        >
          <source src="https://videos.pexels.com/video-files/4488931/4488931-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        
        {/* Gradients to blend with sections */}
        <div className="absolute inset-0 bg-[#050505]/60 z-10" />
        <div className="absolute top-1/2 left-[160px] -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.05] blur-[150px] rounded-full pointer-events-none z-10" />
      </div>

      <div className="relative z-20 max-w-[1600px] mx-auto px-6 md:px-[140px] text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <span className="font-body text-[#D4AF37] uppercase tracking-[5px] text-[13px] font-semibold mb-4 block">
            The Elite Standard
          </span>
          <h2 className="font-display text-white text-[32px] md:text-[48px] leading-[1.1] font-bold mb-6 drop-shadow-2xl">
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D76B]">Luxury Mobility</span>
          </h2>
          <p className="font-body text-white/80 text-[16px] md:text-[18px] leading-[1.8] max-w-3xl mx-auto font-light tracking-wide" style={{ marginBottom: '80px' }}>
            Every journey with Velox is crafted to exceed expectations. 
            From curated vehicle selections to personalized concierge support, 
            we engineer an atmosphere of absolute prestige and uncompromising comfort.
          </p>
        </motion.div>
      </div>
      
    </section>
  );
}
