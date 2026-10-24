"use client";

import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function CarSidebar({ car }) {
  const { pricePerDay, available, bookingCount, model } = car;
  
  // Calculate mock extended pricing based on daily
  const priceWeekly = pricePerDay * 6; // slightly discounted
  const priceMonthly = pricePerDay * 22; // heavily discounted
  
  // WhatsApp Message Formatting
  const defaultNumber = "971501234567";
  const message = encodeURIComponent(`Hello, I am interested in reserving the ${car.brand} ${car.model}. Please let me know the availability.`);
  const waLink = `https://wa.me/${defaultNumber}?text=${message}`;

  return (
    <div className="sticky top-28 w-full max-w-sm ml-auto">
      
      {/* ── Glassmorphism Card ── */}
      <div 
        className="rounded-[24px] p-8 overflow-hidden relative"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Animated top edge glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6B25E] to-transparent opacity-50" />

        {/* ── Status Banner ── */}
        <div className="flex justify-between items-center mb-8">
          <span 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-condensed tracking-widest uppercase"
            style={{
              background: available ? "rgba(0,255,153,0.1)" : "rgba(255,77,77,0.1)",
              color: available ? "#00FF99" : "#FF4D4D",
              border: `1px solid ${available ? "rgba(0,255,153,0.3)" : "rgba(255,77,77,0.3)"}`,
            }}
          >
            <span 
              className={`w-2 h-2 rounded-full ${available ? 'animate-pulse' : ''}`} 
              style={{ 
                background: available ? "#00FF99" : "#FF4D4D",
                boxShadow: available ? "0 0 8px #00FF99" : "none"
              }} 
            />
            {available ? "Available Now" : "Currently Booked"}
          </span>
          
          {bookingCount && (
            <span className="text-[11px] font-body text-[#D6B25E] flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Booked {bookingCount} times
            </span>
          )}
        </div>

        {/* ── Pricing Structure ── */}
        <div className="space-y-6 mb-8">
          {/* Daily */}
          <div>
            <p className="text-[10px] font-body text-gray-400 uppercase tracking-widest mb-1">Daily Rate</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-4xl text-white tracking-tight">{formatPrice(pricePerDay)}</span>
              <span className="text-gray-500 font-body">/ day</span>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-full h-[1px] bg-white/5" />

          {/* Extended Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-body text-gray-400 uppercase tracking-widest mb-1">Weekly</p>
              <p className="font-body text-white font-medium">{formatPrice(priceWeekly)}</p>
            </div>
            <div>
              <p className="text-[10px] font-body text-gray-400 uppercase tracking-widest mb-1">Monthly</p>
              <p className="font-body text-white font-medium">{formatPrice(priceMonthly)}</p>
            </div>
          </div>
        </div>

        {/* ── Security Deposit ── */}
        <div className="bg-black/30 rounded-xl p-4 mb-8 border border-white/5 flex items-start gap-3">
          <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <div>
            <p className="text-sm text-white font-medium mb-0.5">Includes Full Insurance</p>
            <p className="text-xs text-gray-400 font-body">Security deposit: AED 5,000 (Refundable)</p>
          </div>
        </div>

        {/* ── WhatsApp CTA ── */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-full font-body font-bold uppercase tracking-widest text-[13px] transition-all duration-400 overflow-hidden"
          style={{
            background: available ? "linear-gradient(135deg, #E0BE6F, #B68A2F)" : "#333",
            color: available ? "black" : "#888",
            pointerEvents: available ? "auto" : "none",
            boxShadow: available ? "0 10px 30px rgba(214,178,94,0.3)" : "none",
          }}
          onMouseEnter={e => {
            if(available) {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 18px 40px rgba(214,178,94,0.4)";
            }
          }}
          onMouseLeave={e => {
            if(available) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(214,178,94,0.3)";
            }
          }}
        >
          {available ? (
            <>
              {/* WhatsApp Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
              </svg>
              Reserve via WhatsApp
            </>
          ) : "Currently Unavailable"}
        </a>
      </div>

      {/* ── Urgency Banner ── */}
      {available && (
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 font-body text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D6B25E] animate-pulse" />
          Only 2 left this week.
        </div>
      )}
    </div>
  );
}
