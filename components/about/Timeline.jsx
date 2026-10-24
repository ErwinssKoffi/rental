"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const timelineEvents = [
  { year: "2022", title: "VELOX Founded", description: "Launched with a small, highly curated fleet of luxury sedans in London." },
  { year: "2023", title: "5K Clients Reached", description: "Established a strong reputation for unparalleled service and executive transport." },
  { year: "2024", title: "Expanded Luxury Fleet", description: "Introduced hypercars and bespoke SUVs to meet the demands of our elite clientele." },
  { year: "2025", title: "International Premium Services", description: "Expanding our white-glove concierge and delivery services across Europe." }
];

export default function Timeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative w-full py-[160px] bg-[#050505] overflow-hidden">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/images/timeline-bg.png')" }}
      />
      
      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-[#050505]" />
      <div className="absolute inset-0 z-0 bg-[#0A0A0A]/70" />

      <div className="relative z-10 w-full" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px' }}>
        
        <div className="flex flex-col items-center justify-center text-center mb-[100px]">
          <span className="font-body text-[#D4AF37] uppercase tracking-[5px] text-[13px] font-semibold mb-[24px] block">
            Our Journey
          </span>
          <h2 className="font-display text-white text-[32px] md:text-[38px] leading-[1.1] font-bold">
            The Velox Timeline
          </h2>
        </div>

        <div className="w-full flex flex-col items-center justify-center" style={{ marginBottom: '80px' }}>
          <div className="space-y-[100px] w-full flex flex-col items-center justify-center">
            {timelineEvents.map((event, index) => {
              return (
                <motion.div 
                  key={event.year} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  className="group w-full flex flex-col items-center text-center"
                >
                  <div className="mb-3">
                    <span className="font-display text-[#D4AF37] text-[16px] md:text-[20px] font-bold tracking-[5px] uppercase">
                      {event.year}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-white text-[22px] md:text-[26px] font-bold mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {event.title}
                  </h3>
                  
                  <p className="font-body text-white/50 text-[13px] md:text-[14px] leading-[1.7] font-light max-w-[500px] mx-auto">
                    {event.description}
                  </p>

                  {/* Aesthetic Separator for non-last items */}
                  {index !== timelineEvents.length - 1 && (
                    <div className="mt-[60px] w-[1px] h-[40px] bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
