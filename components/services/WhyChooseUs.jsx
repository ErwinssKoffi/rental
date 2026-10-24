"use client";

import { motion } from "framer-motion";
import { Headphones, ShieldCheck, CarFront, Zap } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Headphones,
    title: "24/7 Premium Support",
    description: "Dedicated concierge team available around the clock to assist with your bespoke requests."
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Fully Insured Vehicles",
    description: "Comprehensive elite coverage providing complete peace of mind throughout your journey."
  },
  {
    id: 3,
    icon: CarFront,
    title: "Exclusive Luxury Fleet",
    description: "Immaculate collection of the world's finest automotive engineering and design."
  },
  {
    id: 4,
    icon: Zap,
    title: "Instant Seamless Booking",
    description: "A frictionless, white-glove reservation process designed for your ultimate convenience."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="relative pt-[140px] bg-[#0A0A0A] border-t border-white/[0.05]" style={{ paddingBottom: '200px' }}>
      <div className="w-full pl-6 md:pl-[160px] pr-6 md:pr-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative w-[80px] h-[80px] rounded-full flex items-center justify-center mb-6">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-full blur-xl group-hover:bg-[#D4AF37]/15 transition-colors duration-500" />
                {/* Icon Container */}
                <div className="relative z-10 w-[60px] h-[60px] rounded-full bg-[#111111] border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/30 transition-colors duration-500">
                  <feature.icon size={24} className="text-[#D4AF37] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              
              <h4 className="font-display text-white text-[22px] font-bold mb-3 tracking-wide">
                {feature.title}
              </h4>
              
              <p className="font-body text-white/60 text-[16px] leading-[1.6] max-w-[280px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
