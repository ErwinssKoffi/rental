"use client";

import { motion } from "framer-motion";
import { UserCheck, Plane, Briefcase, Gem, Rocket, Key } from "lucide-react";

const services = [
  {
    id: 1,
    icon: UserCheck,
    title: "Chauffeur Services",
    description: "Professional executive drivers delivering luxury, comfort, and punctual transportation tailored to your schedule."
  },
  {
    id: 2,
    icon: Plane,
    title: "Airport Transfers",
    description: "Real-time flight tracking, luggage assistance, and a seamless VIP pickup experience straight from the tarmac."
  },
  {
    id: 3,
    icon: Briefcase,
    title: "Business Rentals",
    description: "Exclusive corporate accounts, long-term executive fleet rentals, and dedicated account management for professionals."
  },
  {
    id: 4,
    icon: Gem,
    title: "Wedding Luxury Cars",
    description: "Make your grand entrance unforgettable with our pristine Rolls-Royce and Bentley fleet, complete with VIP chauffeurs."
  },
  {
    id: 5,
    icon: Rocket,
    title: "Sports Car Experience",
    description: "Exhilarating weekend drives and photography packages featuring our elite Ferrari, Lamborghini, and McLaren models."
  },
  {
    id: 6,
    icon: Key,
    title: "Concierge Service",
    description: "Personalized assistance including luxury hotel delivery, custom requests, and premium lifestyle recommendations."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function ServicesGrid() {
  return (
    <section className="relative w-full py-[140px] bg-[#050505] overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
        
        <div className="text-center flex flex-col items-center" style={{ marginBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-body text-[#D4AF37] uppercase tracking-[5px] text-[13px] font-semibold mb-4 block"
          >
            The Velox Standard
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-white text-[40px] md:text-[52px] leading-[1.15] font-bold"
          >
            Premium Services Collection
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: '32px',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingBottom: '80px',
            boxSizing: 'border-box'
          }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group relative bg-white/[0.02] border border-white/[0.08] rounded-[30px] p-[40px] flex flex-col items-center text-center transition-all duration-[400ms] ease-out hover:-translate-y-[10px] hover:border-[#D4AF37]/45 hover:shadow-[0_20px_60px_rgba(212,175,55,0.12)] overflow-hidden"
              style={{ width: '340px', flexShrink: 0, minHeight: '300px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="w-[80px] h-[80px] rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-[30px] group-hover:scale-110 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/40 transition-all duration-400 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <service.icon size={32} className="text-[#D4AF37]" />
              </div>
              
              <h3 className="font-display text-white text-[24px] font-bold mb-[16px] group-hover:text-[#D4AF37] transition-colors duration-300">
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
