"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function MeetTheTeam() {
  return (
    <section className="relative w-full pt-[200px] pb-[200px] bg-[#050505] border-t border-white/[0.05] overflow-hidden">
      <div className="relative z-10 w-full" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px' }}>
        
        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '30px' }}
            className="flex flex-col items-center"
          >
            <span className="font-body text-[#D4AF37] uppercase tracking-[5px] text-[13px] font-semibold mb-[24px] block">
              Leadership
            </span>
            <h2 className="font-display text-white text-[32px] md:text-[48px] leading-[1.08] font-bold mb-[30px]">
              Meet The Team
            </h2>
            <p className="font-body text-white/50 text-[16px] md:text-[17px] leading-[1.8] font-light max-w-[640px] mx-auto my-10">
              VELOX is led by a passionate team of automotive enthusiasts and digital innovators dedicated to redefining luxury mobility.
            </p>
          </motion.div>

          {/* Team Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ marginBottom: '70px' }}
            className="w-full flex justify-center"
          >
            <div className="group relative w-full max-w-[480px] bg-white/[0.02] border border-white/[0.07] rounded-[40px] p-[60px_40px] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-[0_30px_70px_rgba(212,175,55,0.08)] hover:-translate-y-[10px]">
              
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-[180px] h-[180px] mb-10 rounded-full border border-white/10 p-2 group-hover:border-[#D4AF37]/40 transition-all duration-500 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center group-hover:scale-105 transition-transform duration-700 overflow-hidden">
                    <span className="font-display text-[#D4AF37] text-[84px] font-bold opacity-40">D</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-display text-white text-[34px] font-bold tracking-tight group-hover:text-[#D4AF37] transition-colors duration-300">
                    Dalin Alkuwatli
                  </h3>
                  <span className="font-body text-[#D4AF37] text-[13px] uppercase tracking-[4px] block mb-8 mt-3 font-semibold">
                    Founder & Creative Developer
                  </span>
                  <p className="font-body text-white/50 text-[16px] md:text-[17px] leading-[1.8] font-light max-w-[320px] mx-auto mb-12">
                    Passionate about creating luxury digital experiences through modern UI/UX and premium web technologies.
                  </p>
                  
                  {/* Socials */}
                  <div className="flex items-center justify-center gap-6">
                    <button className="w-[48px] h-[48px] rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:-translate-y-1 transition-all duration-300">
                      <FaLinkedin size={20} />
                    </button>
                    <button className="w-[48px] h-[48px] rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:-translate-y-1 transition-all duration-300">
                      <FaTwitter size={20} />
                    </button>
                    <button className="w-[48px] h-[48px] rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:-translate-y-1 transition-all duration-300">
                      <FaEnvelope size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
