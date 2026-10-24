"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CarGallery from "@/components/cars/CarGallery";
import CarSidebar from "@/components/cars/CarSidebar";
import CarSpecs from "@/components/cars/CarSpecs";
import CarPerformance from "@/components/cars/CarPerformance";
import CarColors from "@/components/cars/CarColors";
import CarCard from "@/components/cars/CarCard";

function FadeInView({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function CarClientView({ car, relatedCars }) {
  // Setup color state if colors exist
  const [activeColor, setActiveColor] = useState(car.colors?.[0] || null);
  
  const gallery = activeColor ? activeColor.gallery : (car.gallery || [car.image, car.image, car.image]);
  const performance = car.performance || { speed: 85, comfort: 90, luxury: 88, economy: 70 };
  const reviews = car.reviews || [];

  return (
    <>
      {/* ── 1. Hero Gallery ── */}
      <div className="pt-20">
        <CarGallery gallery={gallery} video={car.video} brand={car.brand} model={car.model} activeColor={activeColor} />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-[60px] pt-[160px] pb-[100px]">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-body text-gray-500 tracking-widest uppercase mb-[80px]" style={{ paddingLeft: '80px' }}>
          <Link href="/" className="hover:text-[#D6B25E] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-[#D6B25E] transition-colors">Fleet</Link>
          <span>/</span>
          <span className="text-white">{car.brand} {car.model}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* ── Left Column: Content ── */}
          <div className="flex-1 space-y-0" style={{ paddingLeft: '80px' }}>
            
            {/* 2. Vehicle Title */}
            <FadeInView>
              <div style={{ marginBottom: '80px' }}>
                <p className="text-[18px] font-condensed text-[#D6B25E] tracking-[0.3em] uppercase mb-4">{car.brand}</p>
                <h1 className="font-display font-bold text-4xl md:text-[48px] lg:text-[56px] text-white tracking-tight leading-[1.05] mb-8">
                  {car.model}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6">
                  {car.rating && (
                    <div className="flex items-center gap-1.5 text-white font-condensed">
                      <span className="text-[#D6B25E] text-xl">★</span>
                      <span className="font-bold text-lg">{car.rating}</span>
                      <span className="text-gray-500 text-sm font-body">({reviews.length} Reviews)</span>
                    </div>
                  )}
                  {car.badge && (
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-condensed text-white uppercase tracking-widest">
                      {car.badge}
                    </span>
                  )}
                </div>
              </div>
            </FadeInView>

            {/* Performance Visualization */}
            <FadeInView delay={100}>
              <CarPerformance performance={performance} />
            </FadeInView>

            {/* 3. Technical Specifications & 4. Amenities */}
            <FadeInView delay={200}>
              <CarSpecs car={car} />
            </FadeInView>

            {/* 5. Available Color Variants */}
            {car.colors && car.colors.length > 0 && (
              <FadeInView delay={300}>
                <CarColors 
                  colors={car.colors} 
                  activeColor={activeColor} 
                  onColorChange={setActiveColor} 
                />
              </FadeInView>
            )}

            {/* 6. Driving Experience */}
            <FadeInView>
              <div className="pt-[100px] border-t border-white/10" style={{ paddingBottom: '100px' }}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                  
                  {/* Left Side: Stats Anchors */}
                  <div className="md:col-span-4 space-y-12">
                    <div>
                      <h4 className="font-display text-3xl text-white mb-2">{car.performance?.acceleration || "3.5s"}</h4>
                      <p className="text-[11px] font-condensed text-[#D6B25E] uppercase tracking-widest">0-100 km/h</p>
                    </div>
                    <div>
                      <h4 className="font-display text-3xl text-white mb-2">{car.performance?.topSpeed || "308 km/h"}</h4>
                      <p className="text-[11px] font-condensed text-[#D6B25E] uppercase tracking-widest">Top Speed</p>
                    </div>
                    <div>
                      <h4 className="font-display text-3xl text-white mb-2">{car.performance?.power || "450 hp"}</h4>
                      <p className="text-[11px] font-condensed text-[#D6B25E] uppercase tracking-widest">Power Output</p>
                    </div>
                  </div>

                  {/* Right Side: Editorial Text */}
                  <div className="md:col-span-8">
                    <h3 className="font-display font-bold text-2xl text-white flex items-center gap-3" style={{ marginBottom: '20px' }}>
                      <span className="w-8 h-[1px] bg-[#D6B25E]" />
                      The Experience
                    </h3>
                    <div 
                      className="font-body"
                      style={{
                        maxWidth: "900px",
                        lineHeight: "1.9",
                        color: "#b8b8b8",
                        fontSize: "16px"
                      }}
                    >
                      <p className="mb-6">
                        {car.description}
                      </p>
                      <p>
                        Driving the {car.brand} {car.model} is an exercise in absolute luxury and precision. 
                        Every detail, from the tactile feedback of the steering wheel to the seamless power delivery, 
                        has been engineered to provide an unparalleled journey. 
                        Whether navigating the sweeping coastal roads or making a commanding entrance at a high-profile 
                        event, this vehicle ensures you arrive not just in comfort, but with undeniable presence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* 7. Rental Terms */}
            <FadeInView>
              <div className="pt-[100px] border-t border-white/10" style={{ paddingBottom: '100px' }}>
                <h3 className="font-display font-bold text-2xl text-white flex items-center gap-3" style={{ marginBottom: '20px' }}>
                  <span className="w-8 h-[1px] bg-[#D6B25E]" />
                  Rental Terms
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { title: "Minimum Age", desc: "25 Years Old" },
                    { title: "Security Deposit", desc: "AED 5,000 (Refundable)" },
                    { title: "Insurance", desc: "Comprehensive Included" },
                    { title: "Mileage", desc: "250 km / Day" },
                    { title: "Delivery", desc: "Available Nationwide" },
                    { title: "Fuel Policy", desc: "Full-to-Full" },
                  ].map((term, idx) => (
                    <div 
                      key={idx}
                      className="p-6 rounded-[18px] border border-white/10 bg-white/[0.02] hover:-translate-y-1 hover:border-[#D6B25E]/40 transition-all duration-300"
                    >
                      <p className="text-[11px] font-condensed text-[#D6B25E] uppercase tracking-widest mb-2">{term.title}</p>
                      <p className="text-lg font-body text-white">{term.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>

            {/* 8. Reviews */}
            {reviews.length > 0 && (
              <FadeInView>
                <div className="py-[100px] border-t border-white/10">
                  <h3 className="font-display font-bold text-2xl text-white flex items-center gap-3" style={{ marginBottom: '20px' }}>
                    <span className="w-8 h-[1px] bg-[#D6B25E]" />
                    Client Testimonials
                  </h3>
                  <div className="space-y-6">
                    {reviews.map((rev, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-white font-condensed uppercase tracking-widest text-lg font-bold mb-1">{rev.customer}</p>
                            <p className="text-sm font-condensed text-gray-500">{new Date(rev.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="flex text-[#D6B25E]">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-xl">{i < Math.floor(rev.rating) ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[#b8b8b8] font-body text-[20px] leading-[1.9] italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInView>
            )}

          </div>

          {/* ── Right Column: Sticky Sidebar ── */}
          <div className="w-full lg:w-[420px] shrink-0">
            <CarSidebar car={car} />
          </div>

        </div>

        {/* 9. Similar Vehicles */}
        {relatedCars.length > 0 && (
          <FadeInView>
            <div className="pt-[60px] border-t border-white/10" style={{ paddingBottom: '160px' }}>
              <h2 className="font-display font-bold text-3xl text-white flex justify-center items-center gap-10 text-center" style={{ marginBottom: '80px' }}>
                <span className="w-12 h-[2px] bg-[#D6B25E]" />
                Similar Vehicles
                <span className="w-12 h-[2px] bg-[#D6B25E]" />
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {relatedCars.map((relatedCar, idx) => (
                  <div key={relatedCar.id} className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-[450px]">
                    <CarCard car={relatedCar} index={idx} />
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        )}

      </div>
    </>
  );
}
