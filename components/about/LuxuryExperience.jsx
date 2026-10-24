"use client";

import { motion } from "framer-motion";
import { Key, Plane, Headphones, ShieldCheck } from "lucide-react";

const services = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "Premium Fleet",
    description: "Luxury and sports vehicles sourced exclusively from world-class automotive brands."
  },
  {
    id: 2,
    icon: Key,
    title: "Chauffeur Services",
    description: "Professional private executive drivers available on demand for your absolute convenience."
  },
  {
    id: 3,
    icon: Plane,
    title: "Airport Delivery",
    description: "White-glove vehicle delivery and collection directly to airports, private FBOs, and hotels."
  },
  {
    id: 4,
    icon: Headphones,
    title: "Concierge Support",
    description: "24/7 personalized customer assistance to handle every detail of your journey."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function LuxuryExperience() {
  return (
    <section className="relative w-full py-[140px] bg-[#050505] overflow-hidden">
      <div className="relative z-10 w-full" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px' }}>
        
        <div className="text-center flex flex-col items-center" style={{ marginBottom: '60px', marginTop: '60px' }}>
          <span className="font-body text-[#D4AF37] uppercase tracking-[5px] text-[13px] font-semibold mb-4 block">
            Why Velox
          </span>
          <h2 className="font-display text-white text-[32px] md:text-[48px] leading-[1.08] font-bold">
            The Luxury Experience
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-[35px]"
          style={{ marginBottom: '80px' }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group relative w-full sm:w-[320px] bg-white/[0.02] border border-white/[0.08] rounded-[30px] p-[40px_30px] flex flex-col items-center text-center transition-all duration-[400ms] ease-out backdrop-blur-xl hover:-translate-y-[10px] hover:border-[#D4AF37]/40 hover:shadow-[0_20px_60px_rgba(212,175,55,0.12)] min-h-[300px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="w-[70px] h-[70px] rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/40 transition-all duration-400 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <service.icon size={28} className="text-[#D4AF37]" />
              </div>
              
              <h3 className="font-display text-white text-[22px] font-bold mb-4 tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="font-body text-white/70 text-[16px] leading-[1.8] font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
