"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function ListCarModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedImages(Array.from(e.dataTransfer.files));
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsSubmitting(false);
      setIsSuccess(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 2000);
  };

  const inputStyles = `
    w-full
    h-[56px]
    px-5
    rounded-xl
    bg-white/[0.03]
    border border-white/10
    text-white
    placeholder:text-zinc-500
    text-[15px]
    tracking-wide
    font-body
    transition-all duration-300
    focus:border-[#c9a84c]
    focus:bg-white/[0.05]
    focus:outline-none
  `;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed
            inset-0
            z-[1000]
            flex
            items-center
            justify-center
            bg-black/80
            backdrop-blur-md
            p-4
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg mx-auto rounded-[24px] border border-white/10 bg-[#0A0A0A] p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Cinematic Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#c9a84c15,transparent_60%)] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="
                absolute top-5 right-5 z-50
                w-9 h-9
                rounded-full
                bg-white/[0.05]
                flex items-center justify-center
                transition-all duration-300
                hover:bg-white/[0.1]
                hover:scale-105
                group
              "
            >
              <X size={16} className="text-white/70 group-hover:text-white transition-colors" />
            </button>

            {!isSuccess ? (
              <div className="relative z-10">
                {/* Header */}
                <div className="mb-6 mt-28 text-center flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-3 justify-center">
                    <div className="h-px w-5 bg-[#c9a84c]/60" />
                    <p className="text-[12px] text-[#c9a84c] font-bold uppercase tracking-[0.35em] font-body">
                      Partnership
                    </p>
                    <div className="h-px w-5 bg-[#c9a84c]/60" />
                  </div>
                  <h2
                    className="
                      text-3xl
                      font-bold
                      text-white
                      font-display
                      mb-1.5
                    "
                  >
                    List Your Luxury Car
                  </h2>
                  <p className="text-zinc-500 text-[14px] leading-[1.5] font-body max-w-[340px]">
                    Join our exclusive fleet. Provide your details and our concierge team will contact you.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 pl-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 font-body">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohammed Al-Salem"
                      className={inputStyles}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 font-body">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@email.com"
                      className={inputStyles}
                    />
                  </div>

                  {/* Car Model */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 font-body">
                      Car Brand &amp; Model
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Porsche 911, Ferrari Roma"
                      className={inputStyles}
                    />
                  </div>

                  {/* Upload Area */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 font-body">
                      Vehicle Images
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="
                        relative w-full 
                        border border-dashed border-white/10
                        rounded-xl bg-white/[0.02]
                        py-6 px-4
                        flex flex-col items-center justify-center text-center cursor-pointer 
                        transition-all duration-300
                        hover:border-[#c9a84c]/50 hover:bg-white/[0.04]
                        group
                      "
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                      />
                      {selectedImages.length > 0 ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                          <CheckCircle2 size={28} className="text-[#c9a84c] mb-2" />
                          <p className="font-display text-white text-[14px] font-bold mb-0.5">
                            {selectedImages.length} Image{selectedImages.length > 1 ? 's' : ''} Ready
                          </p>
                          <p 
                            className="font-body text-zinc-500 text-[11px] hover:text-white transition-colors mt-0.5"
                            onClick={(e) => { e.stopPropagation(); setSelectedImages([]); }}
                          >
                            Remove selection
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud size={28} className="text-[#c9a84c] mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                          <p className="font-display text-white text-[14px] font-bold mb-0.5">Upload Vehicle Images</p>
                          <p className="font-body text-zinc-500 text-[11px]">Drag &amp; drop or click to browse</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 font-body">
                      Vehicle Description
                    </label>
                    <textarea
                      required
                      placeholder="Tell us about your vehicle... (Condition, location, year)"
                      className={`${inputStyles} h-[100px] py-3 resize-none`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      relative
                      w-full
                      h-[52px]
                      mt-1
                      rounded-full
                      bg-[#c9a84c]
                      text-[#050505]
                      font-bold
                      text-[14px]
                      transition-all duration-300
                      hover:scale-[1.01]
                      hover:shadow-[0_10px_20px_rgba(201,168,76,0.2)]
                      active:scale-[0.99]
                      disabled:opacity-80
                      disabled:hover:scale-100
                      overflow-hidden
                      font-body
                    "
                  >
                    <span className="relative z-10 uppercase tracking-wider">
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        "Submit Vehicle"
                      )}
                    </span>
                  </button>
                </form>
              </div>
            ) : (
              /* Success State */
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10 relative z-10"
              >
                <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mb-5 border border-[#c9a84c]/20">
                  <CheckCircle2 size={28} className="text-[#c9a84c]" />
                </div>
                <h3 className="font-display text-[24px] font-bold text-white mb-1.5">Request Received</h3>
                <p className="font-body text-zinc-400 text-[13px] leading-[1.5] max-w-[280px] mx-auto">
                  Our concierge team will review your luxury vehicle details and contact you within 24 hours.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
