"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, X, Loader2 } from "lucide-react";

const GOLD = "#D6B25E"; // Aligning with the palette requested + our existing gold

export default function AuthModal({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop & Cinematic Ambient Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-auto"
          >
            {/* Clickable dark backdrop */}
            <div 
              className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm"
              onClick={onClose}
            />
            
            {/* Ambient Gold Glow Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/[0.05] blur-[120px] pointer-events-none rounded-full" />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: [30, 0, -8, 0], 
                scale: 1,
              }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                opacity: { duration: 0.4 },
                scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.1, 0.55, 1] // initial entrance (0 to 0.1) then infinite float
                }
              }}
              className="relative w-[92%] md:w-[540px] bg-[#0A0A0A]/80 backdrop-blur-[25px] border border-white/[0.08] rounded-[30px] shadow-[0_20px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(212,175,55,0.08)] overflow-hidden z-10"
              style={{ padding: "clamp(35px, 5vw, 50px)" }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-[40px]">
                <h1 className="font-display font-bold text-[48px] md:text-[72px] text-white leading-tight mb-2 drop-shadow-lg">
                  Welcome Back
                </h1>
                <p className="font-body text-[#ffffff8c] text-[13px] md:text-[15px] uppercase tracking-[5px] font-medium">
                  Sign in to your luxury account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-[28px]">
                {/* Email Input */}
                <div className="group">
                  <label className="block font-body text-[#D4AF37] text-[14px] uppercase tracking-[2px] font-semibold mb-[12px] ml-1">
                    Email Address
                  </label>
                  <div className="relative w-full">
                    <div className="absolute left-[22px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail size={20} className="text-white/[0.45] group-focus-within:text-[#D4AF37] transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[65px] bg-white/[0.03] border border-white/[0.08] rounded-[18px] pl-[65px] pr-[25px] text-white font-body text-[18px] transition-all duration-300 focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.25)] focus:bg-white/[0.05] placeholder:text-gray-600"
                      placeholder="client@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <div className="flex justify-between items-center mb-[12px] ml-1">
                    <label className="font-body text-[#D4AF37] text-[14px] uppercase tracking-[2px] font-semibold block">
                      Password
                    </label>
                    <button type="button" className="text-[14px] font-body text-white/[0.5] hover:text-[#D4AF37] transition-colors uppercase tracking-widest mr-2">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative w-full">
                    <div className="absolute left-[22px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock size={20} className="text-white/[0.45] group-focus-within:text-[#D4AF37] transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[65px] bg-white/[0.03] border border-white/[0.08] rounded-[18px] pl-[65px] pr-[60px] text-white font-body text-[18px] transition-all duration-300 focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.25)] focus:bg-white/[0.05] placeholder:text-gray-600 tracking-widest"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-[22px] top-1/2 -translate-y-1/2 text-white/[0.45] hover:text-[#D4AF37] transition-colors flex items-center justify-center h-full"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[65px] mt-[30px] bg-gradient-to-br from-[#D4AF37] to-[#F4D76B] rounded-[18px] text-black font-body font-bold text-[20px] uppercase tracking-[2px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin text-black/70" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Elegant Divider */}
              <div className="relative text-center my-[35px] text-white/[0.45] font-body text-[12px] tracking-[3px] uppercase flex items-center justify-center gap-4">
                <span className="w-[35%] h-[1px] bg-white/[0.08]" />
                <span className="shrink-0">Or continue with</span>
                <span className="w-[35%] h-[1px] bg-white/[0.08]" />
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full h-[65px] bg-white/[0.04] border border-white/[0.08] rounded-[18px] text-white font-body text-[18px] transition-all duration-300 hover:bg-white/[0.08] hover:-translate-y-[2px] flex items-center justify-center gap-4 group"
              >
                <svg className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium tracking-wide">Google</span>
              </button>
              
              <p className="mt-[40px] text-center text-[15px] font-body text-gray-500 tracking-wider">
                Don't have an account? <button className="text-[#D4AF37] hover:text-white transition-colors ml-2 font-medium">Create one</button>
              </p>
            </motion.div>
          </motion.div>

          <style jsx global>{`
            /* Override Webkit Autofill for Dark Luxury Theme */
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active{
                -webkit-box-shadow: 0 0 0 30px #131313 inset !important;
                -webkit-text-fill-color: white !important;
                transition: background-color 5000s ease-in-out 0s;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
