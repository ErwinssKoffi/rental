"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "James Walker",
    role: "CEO, Vertex Capital",
    content: "The most seamless luxury rental experience in London. The chauffeur service was impeccable, and the vehicle was presented in absolute showroom condition.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sophia Bennett",
    role: "Private Wealth Advisor",
    content: "Exceptional vehicles and world-class customer service. The airport transfer eliminated all travel stress. Velox is now my exclusive mobility partner.",
    rating: 5,
  },
  {
    id: 3,
    name: "Marcus Aurelius",
    role: "International Architect",
    content: "I rented the Porsche 911 for a weekend escape. The concierge team handled every detail flawlessly. Truly a $4000-tier experience from start to finish.",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="relative w-full py-[140px] bg-[#050505] overflow-hidden">
      <div className="relative z-10" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
        
        <div className="text-center flex flex-col items-center" style={{ marginBottom: '60px', paddingLeft: '24px', paddingRight: '24px' }}>
          <span className="font-body text-[#D4AF37] uppercase tracking-[5px] text-[13px] font-semibold mb-4 block">
            Client Experiences
          </span>
          <h2 className="font-display text-white text-[32px] md:text-[48px] leading-[1.1] font-bold">
            The Word of Our Clients
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch', gap: '32px', maxWidth: '1260px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '80px', boxSizing: 'border-box' }}>
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="group relative bg-[#0A0A0A] border border-white/[0.05] rounded-[30px] p-[50px] text-center flex flex-col items-center transition-all duration-[400ms] hover:-translate-y-2 hover:border-[#D4AF37]/30 hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)]"
              style={{ width: '380px', flexShrink: 0, minHeight: '350px' }}
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <Star key={index} size={16} className="fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              
              {/* Content */}
              <p className="font-body text-white/80 text-[16px] leading-[1.8] font-light mb-[40px] italic">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="mt-auto flex flex-col items-center gap-4">
                <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6B1A] flex items-center justify-center text-black font-display font-bold text-[24px]">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-display text-white text-[18px] font-bold tracking-wide mb-1">
                    {testimonial.name}
                  </h4>
                  <span className="font-body text-[#D4AF37] text-[13px] uppercase tracking-[2px]">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
