"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What documents are required to rent a luxury vehicle?",
    answer: "You must provide a valid driver's license (held for at least 2 years), a secondary form of government ID, and a major credit card in your name for the security deposit. International renters must also present a valid passport and an International Driving Permit."
  },
  {
    question: "Is comprehensive insurance included in the rental price?",
    answer: "Yes, all Velox rentals include premium comprehensive insurance. However, depending on the vehicle class, a security deposit block is placed on your credit card. You may also opt for our Platinum Liability Waiver for absolute zero-deductible coverage."
  },
  {
    question: "Can I request hotel or airport vehicle delivery?",
    answer: "Absolutely. We offer white-glove delivery and collection services to any major hotel, private residence, or airport terminal within a 50-mile radius of our boutiques, ensuring a seamless handover."
  },
  {
    question: "Are professional chauffeurs available for all vehicles?",
    answer: "Yes, our executive chauffeur service can be requested for our Rolls-Royce, Bentley, and Mercedes-Benz fleet. All drivers are rigorously vetted, professionally trained, and deeply familiar with the local area."
  },
  {
    question: "What is your cancellation and modification policy?",
    answer: "We offer complimentary cancellation up to 48 hours before your scheduled reservation. Cancellations made within 48 hours are subject to a 50% retention fee. Modifications are subject to fleet availability."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative py-[120px] bg-[#0A0A0A] border-t border-white/[0.05] z-0">
      {/* Luxury Background Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.05] blur-[120px] z-[-1] pointer-events-none" />

      <div className="relative z-10" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
        
        <div className="text-center flex flex-col items-center" style={{ marginBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
          <span className="font-body text-[#D4AF37] uppercase tracking-[6px] text-[13px] font-semibold mb-[24px] block">
            Information
          </span>
          <h2 className="font-display text-white text-[32px] md:text-[48px] leading-[1.1] font-bold max-w-[700px] mx-auto">
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ width: '100%', maxWidth: '950px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '80px', boxSizing: 'border-box' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className={`group bg-white/[0.025] border border-white/[0.08] rounded-[26px] mb-[24px] overflow-hidden transition-all duration-400 ease-out hover:-translate-y-[4px] hover:border-[#D4AF37]/35 hover:shadow-[0_15px_50px_rgba(212,175,55,0.08)] ${isOpen ? 'border-[#D4AF37]/35 shadow-[0_15px_50px_rgba(212,175,55,0.08)]' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between px-[24px] py-[24px] md:px-[34px] md:py-[30px] text-left"
                >
                  <span className={`font-display text-[20px] md:text-[24px] font-semibold leading-[1.4] transition-colors duration-300 ${isOpen ? 'text-[#D4AF37]' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  
                  <div className={`min-w-[44px] min-h-[44px] w-[44px] h-[44px] rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ml-6 group-hover:border-[#D4AF37]/40 ${isOpen ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/10 text-white/60 group-hover:text-[#D4AF37]'}`}>
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-[24px] pb-[24px] md:px-[34px] md:pb-[34px] pt-0 font-body text-white/70 text-[16px] md:text-[18px] leading-[1.9] font-light text-left">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
