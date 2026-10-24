"use client";

import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function SignInButton({ onClick }) {
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
        px-6
        rounded-full
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-[#D4AF37]/50
        hover:bg-white/[0.08]
        hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]
        overflow-hidden
      "
    >
      {/* Animated Glow */}
      <span
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-transparent
          via-[#D4AF37]/10
          to-transparent
          -translate-x-full
          group-hover:translate-x-full
          transition-transform
          duration-1000
          ease-in-out
        "
      />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        <LogIn size={15} className="text-[#D4AF37] transition-colors group-hover:text-[#F4D76B]" />
        <span className="font-body text-[12px] font-bold tracking-[0.15em] uppercase text-white/90 group-hover:text-white transition-colors">
          Sign In
        </span>
      </div>
    </motion.button>
  );
}
