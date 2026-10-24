"use client";

import { motion } from "framer-motion";

export default function ListYourCarButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="
        group
        relative
        flex
        items-center
        justify-center
        h-[46px]
        px-7
        rounded-full
        bg-[#D4AF37]
        text-black
        transition-all
        duration-300
        shadow-[0_0_20px_rgba(212,175,55,0.25)]
        hover:bg-[#F4D76B]
        hover:shadow-[0_0_35px_rgba(212,175,55,0.45)]
        overflow-hidden
      "
    >
      <span className="relative z-10 font-body text-[12px] font-bold tracking-[0.15em] uppercase">
        LIST YOUR CAR
      </span>

      {/* Luxury shine animation */}
      <span
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-transparent
          via-white/40
          to-transparent
          -translate-x-full
          group-hover:translate-x-full
          transition-transform
          duration-1000
          ease-in-out
        "
      />
    </motion.button>
  );
}
