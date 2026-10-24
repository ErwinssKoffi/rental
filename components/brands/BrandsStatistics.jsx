"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Simple custom hook for animating numbers
function useAnimatedCounter(endValue, duration, inView) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        // easeOutQuart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * endValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [endValue, duration, inView]);

  return count;
}

function StatItem({ value, suffix, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useAnimatedCounter(value, 2000, inView);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center relative group"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[#D4AF37]/[0.03] blur-[40px] rounded-full group-hover:bg-[#D4AF37]/[0.08] transition-colors duration-700 pointer-events-none" />
      
      <h2 className="relative z-10 text-[60px] lg:text-[82px] font-bold text-[#d4af37] leading-none drop-shadow-[0_0_25px_rgba(212,175,55,0.2)] font-display">
        {count}{suffix}
      </h2>
      
      <p className="relative z-10 mt-[18px] text-[15px] tracking-[4px] uppercase text-white/75 font-body text-center">
        {label}
      </p>
    </motion.div>
  );
}

export default function BrandsStatistics() {
  return (
    <section className="w-full py-[120px] bg-[#050505] flex justify-center items-center border-y border-white/[0.05] relative overflow-hidden">
      <div className="w-full max-w-[1400px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[50px] lg:gap-[60px] text-center items-center px-6 relative z-10">
        <StatItem value={15} suffix="+" label="Luxury Brands" delay={0} />
        <StatItem value={200} suffix="+" label="Premium Vehicles" delay={0.15} />
        <StatItem value={24} suffix="/7" label="Concierge Support" delay={0.3} />
        <StatItem value={15} suffix="K+" label="Satisfied Clients" delay={0.45} />
      </div>
    </section>
  );
}
