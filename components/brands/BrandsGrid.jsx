"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BrandModal from "./BrandModal";

const brandsData = [
  {
    id: 1,
    name: "Mercedes-Benz",
    subtitle: "Luxury, innovation, and executive comfort.",
    story: "Renowned for pioneering automotive safety and inventing the first petrol-powered car, Mercedes-Benz embodies the pinnacle of executive luxury and sophisticated engineering.",
    country: "Germany",
    founded: "1926",
    class: "Executive Luxury",
    specialty: "Comfort & Tech",
    hpRange: "255 - 603 HP",
    availableCars: 12,
    priceRange: "$250 - $900"
  },
  {
    id: 2,
    name: "BMW",
    subtitle: "The ultimate driving machine.",
    story: "BMW delivers an unparalleled driving experience by perfectly balancing athletic performance with high-end interior luxury and cutting-edge digital integration.",
    country: "Germany",
    founded: "1916",
    class: "Sport Luxury",
    specialty: "Performance",
    hpRange: "255 - 617 HP",
    availableCars: 15,
    priceRange: "$200 - $850"
  },
  {
    id: 3,
    name: "Audi",
    subtitle: "Vorsprung durch Technik.",
    story: "Audi combines minimalist, progressive design with their legendary Quattro all-wheel-drive system, offering secure, fast, and incredibly comfortable grand touring.",
    country: "Germany",
    founded: "1909",
    class: "Tech Luxury",
    specialty: "AWD & Design",
    hpRange: "201 - 591 HP",
    availableCars: 10,
    priceRange: "$180 - $800"
  },
  {
    id: 4,
    name: "Porsche",
    subtitle: "Precision engineering and timeless design.",
    story: "Known for precision engineering and timeless design, Porsche delivers a driving experience unlike any other, blending track-ready capability with everyday usability.",
    country: "Germany",
    founded: "1931",
    class: "Sports Performance",
    specialty: "Handling",
    hpRange: "300 - 640 HP",
    availableCars: 8,
    priceRange: "$350 - $1,200"
  },
  {
    id: 5,
    name: "Lamborghini",
    subtitle: "Aggressive styling and roaring V10s.",
    story: "Lamborghini builds uncompromising, naturally aspirated supercars that demand attention. Experience dramatic styling and raw, visceral power.",
    country: "Italy",
    founded: "1963",
    class: "Exotic Supercar",
    specialty: "Raw Power",
    hpRange: "602 - 759 HP",
    availableCars: 4,
    priceRange: "$1,200 - $2,500"
  },
  {
    id: 6,
    name: "Ferrari",
    subtitle: "The prancing horse of Maranello.",
    story: "Ferrari represents the soul of motorsport. Each vehicle is a masterpiece of Italian design, delivering spine-tingling exhaust notes and telepathic handling.",
    country: "Italy",
    founded: "1939",
    class: "Exotic Supercar",
    specialty: "Track Dynamics",
    hpRange: "612 - 986 HP",
    availableCars: 3,
    priceRange: "$1,500 - $3,000"
  },
  {
    id: 7,
    name: "Bentley",
    subtitle: "Unrivalled grand touring luxury.",
    story: "Bentley crafts the ultimate grand tourers, combining hand-stitched leather, exquisite wood veneers, and effortless W12 power for continental cross-country travel.",
    country: "United Kingdom",
    founded: "1919",
    class: "Ultra Luxury",
    specialty: "Grand Touring",
    hpRange: "542 - 650 HP",
    availableCars: 5,
    priceRange: "$900 - $1,800"
  },
  {
    id: 8,
    name: "Rolls-Royce",
    subtitle: "The absolute pinnacle of automotive opulence.",
    story: "A Rolls-Royce is not just driven, it is experienced. With their signature 'Magic Carpet Ride' suspension, they offer the quietest, most luxurious cabins in the world.",
    country: "United Kingdom",
    founded: "1904",
    class: "Bespoke Luxury",
    specialty: "Ultimate Comfort",
    hpRange: "563 - 592 HP",
    availableCars: 4,
    priceRange: "$1,500 - $4,000"
  },
  {
    id: 9,
    name: "Range Rover",
    subtitle: "Refined capability on any terrain.",
    story: "Range Rover invented the luxury SUV. It effortlessly combines aristocratic comfort with unstoppable off-road capability and commanding presence.",
    country: "United Kingdom",
    founded: "1970",
    class: "Luxury SUV",
    specialty: "All-Terrain",
    hpRange: "395 - 523 HP",
    availableCars: 6,
    priceRange: "$300 - $900"
  },
  {
    id: 10,
    name: "Maserati",
    subtitle: "Italian passion and elegance.",
    story: "Maserati injects Italian passion into luxury grand touring. Expect beautifully sculpted exteriors matched with sonorous, Ferrari-derived engines.",
    country: "Italy",
    founded: "1914",
    class: "Italian Luxury",
    specialty: "Style & Sound",
    hpRange: "345 - 580 HP",
    availableCars: 3,
    priceRange: "$280 - $850"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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

export default function BrandsGrid() {
  const [selectedBrand, setSelectedBrand] = useState(null);

  return (
    <>
      <section className="relative w-full py-32 bg-[#050505] overflow-hidden px-8 sm:px-12 lg:px-24 xl:px-32" id="brands">
        <div className="w-full relative z-10">
          
          <div className="text-center mb-32" style={{ marginBottom: '100px' }}>
            <span className="text-[#d4af37] tracking-[5px] text-[13px] font-semibold uppercase block mb-4">
              Curated Selection
            </span>
            <h2 className="font-display text-white text-[40px] md:text-[52px] font-bold leading-[1.15]">
              Featured Luxury Brands
            </h2>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full"
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '8px',
              maxWidth: '1400px',
              margin: '0 auto 120px auto'
            }}
          >
            {brandsData.map((brand) => (
              <motion.div
                key={brand.id}
                variants={cardVariants}
                onClick={() => setSelectedBrand(brand)}
                className="
                  group relative w-[240px] min-h-[200px] p-5 
                  rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl 
                  transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4AF37] 
                  hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] cursor-pointer overflow-hidden flex flex-col justify-center items-center text-center
                "
              >
                {/* Internal Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 text-center">
                  <div className="w-[50px] h-[50px] mx-auto mb-3 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/25 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <span className="font-display text-[#D4AF37] text-xl font-bold">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-white text-lg font-bold mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {brand.name}
                  </h3>
                  
                  <p className="font-body text-white/60 text-[13px] leading-relaxed font-light line-clamp-2">
                    {brand.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Details Modal */}
      <BrandModal 
        brand={selectedBrand} 
        isOpen={!!selectedBrand} 
        onClose={() => setSelectedBrand(null)} 
      />
    </>
  );
}
