"use client";

import { useEffect, useState, useRef } from "react";

export default function CarPerformance({ performance }) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const metrics = [
    { label: "Speed", value: performance?.speed || 85 },
    { label: "Comfort", value: performance?.comfort || 90 },
    { label: "Luxury", value: performance?.luxury || 88 },
    { label: "Efficiency", value: performance?.economy || 70 },
  ];

  return (
    <div ref={ref} className="pt-8 pb-[80px] border-t border-white/10">
      <h3 className="font-display font-bold text-2xl text-white flex items-center gap-3" style={{ marginBottom: '24px' }}>
        <span className="w-8 h-[1px] bg-[#D6B25E]" />
        Performance Metrics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-condensed text-gray-400 uppercase tracking-widest">{metric.label}</span>
              <span className="text-lg font-display font-bold text-[#D6B25E]">{metric.value}%</span>
            </div>
            {/* Track */}
            <div className="w-full h-[3px] bg-white/10 rounded-full relative">
              {/* Fill */}
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out flex justify-end items-center"
                style={{ 
                  width: mounted ? `${metric.value}%` : "0%",
                  background: "linear-gradient(90deg, #b08a2e, #D6B25E)",
                  boxShadow: mounted ? "0 0 10px rgba(214,178,94,0.5)" : "none"
                }}
              >
                {/* Glowing Endpoint Dot */}
                <div 
                  className="w-2.5 h-2.5 rounded-full bg-white transition-opacity duration-1000 delay-300"
                  style={{
                    boxShadow: "0 0 12px 3px rgba(214,178,94,0.8)",
                    transform: "translateX(50%)",
                    opacity: mounted ? 1 : 0
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
