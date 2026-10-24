"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+44 20 7946 0958",
    sub: "Available 24/7 for VIP clients",
  },
  {
    icon: Mail,
    label: "Email",
    value: "concierge@veloxrentals.com",
    sub: "Response within 1 hour",
  },
  {
    icon: MapPin,
    label: "Boutique",
    value: "Mayfair, London W1K 4PS",
    sub: "Mon – Sun, 8:00 AM – 10:00 PM",
  },
];

function FloatingField({ label, children, focused, hasValue }) {
  return (
    <div className="relative" style={{ marginBottom: "8px" }}>
      <label
        style={{
          position: "absolute",
          left: "20px",
          top: focused || hasValue ? "8px" : "50%",
          transform: focused || hasValue ? "translateY(0)" : "translateY(-50%)",
          fontSize: focused || hasValue ? "11px" : "15px",
          color: focused ? "#D4AF37" : "rgba(255,255,255,0.4)",
          letterSpacing: focused || hasValue ? "2px" : "0px",
          textTransform: focused || hasValue ? "uppercase" : "none",
          transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
          fontFamily: "inherit",
          fontWeight: focused || hasValue ? "600" : "400",
          zIndex: 1,
        }}
      >
        {label}
      </label>
      {children}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          width: focused ? "100%" : "0%",
          background: "linear-gradient(90deg, #D4AF37, #F4D76B)",
          borderRadius: "0 0 14px 14px",
          transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  const inputBase = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "24px 20px 10px",
    color: "#fff",
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease, background 0.3s ease",
  };

  const inputFocused = {
    borderColor: "rgba(212,175,55,0.4)",
    background: "rgba(212,175,55,0.03)",
  };

  return (
    <main className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#D4AF37]/[0.04] blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div
        className="relative z-10"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "160px 24px 120px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center flex flex-col items-center"
          style={{ marginBottom: "80px" }}
        >
          <span className="font-body text-[#D4AF37] uppercase tracking-[5px] text-[13px] font-semibold mb-4 block">
            Get In Touch
          </span>
          <h1 className="font-display text-white text-[40px] md:text-[64px] leading-[1.08] font-bold">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D76B]">
              Concierge
            </span>
          </h1>
          <p className="font-body text-white/50 text-[17px] leading-[1.9] font-light mt-6 max-w-[520px] text-center">
            Our dedicated concierge team is available around the clock to curate
            your perfect luxury mobility experience.
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "80px",
          }}
        >
          {contactInfo.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="group bg-white/[0.02] border border-white/[0.07] rounded-[22px] p-[28px] flex flex-col items-center text-center transition-all duration-400 hover:border-[#D4AF37]/35 hover:shadow-[0_20px_50px_rgba(212,175,55,0.08)] hover:-translate-y-2"
              style={{ width: "270px", maxWidth: "270px", flexShrink: 0, flexGrow: 0 }}
            >
              <div className="w-[56px] h-[56px] rounded-full bg-[#D4AF37]/[0.08] border border-[#D4AF37]/20 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/15 group-hover:scale-110 transition-all duration-400 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                <item.icon size={24} className="text-[#D4AF37]" />
              </div>
              <span className="font-body text-[#D4AF37] text-[11px] uppercase tracking-[4px] font-semibold mb-3 block">
                {item.label}
              </span>
              <p className="font-display text-white text-[17px] font-bold mb-1 leading-snug">
                {item.value}
              </p>
              <p className="font-body text-white/40 text-[13px] mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ maxWidth: "720px", margin: "0 auto" }}
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
                style={{
                  background: "rgba(212,175,55,0.04)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  borderRadius: "30px",
                  padding: "72px 48px",
                }}
              >
                <div className="w-[80px] h-[80px] rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-7 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                  <CheckCircle size={36} className="text-[#D4AF37]" />
                </div>
                <h2 className="font-display text-white text-[32px] font-bold mb-3">
                  Message Received
                </h2>
                <p className="font-body text-white/50 text-[16px] leading-[1.8]">
                  Our concierge will reach out to you within the hour.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "32px",
                  padding: "56px 48px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
                }}
              >
                {/* Name */}
                <FloatingField
                  label="Full Name"
                  focused={focused === "name"}
                  hasValue={!!form.name}
                >
                  <input
                    required
                    type="text"
                    value={form.name}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      ...inputBase,
                      ...(focused === "name" ? inputFocused : {}),
                    }}
                  />
                </FloatingField>

                {/* Email */}
                <FloatingField
                  label="Email Address"
                  focused={focused === "email"}
                  hasValue={!!form.email}
                >
                  <input
                    required
                    type="email"
                    value={form.email}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      ...inputBase,
                      ...(focused === "email" ? inputFocused : {}),
                    }}
                  />
                </FloatingField>

                {/* Message */}
                <FloatingField
                  label="Message"
                  focused={focused === "message"}
                  hasValue={!!form.message}
                >
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused("")}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    style={{
                      ...inputBase,
                      ...(focused === "message" ? inputFocused : {}),
                      padding: "24px 20px 10px",
                      resize: "none",
                    }}
                  />
                </FloatingField>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 font-body font-bold text-[14px] uppercase tracking-[2px] text-[#050505] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(212,175,55,0.4)]"
                  style={{
                    height: "58px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #D4AF37, #F4D76B)",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  Send Message
                  <ArrowRight size={17} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
