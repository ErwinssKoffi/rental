"use client";

import { X, Loader2 } from "lucide-react";

export const GOLD = "#D4AF37";

const inputBase =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white " +
  "placeholder:text-white/30 outline-none transition-colors focus:border-[#D4AF37]/60";

export function Field({ label, children, hint }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[11px] font-bold uppercase tracking-widest text-white/50">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-white/35">{hint}</span>}
    </label>
  );
}

export function TextInput(props) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-[96px] resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={`${inputBase} appearance-none ${props.className ?? ""}`}
    >
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group"
    >
      <span
        className="relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0"
        style={{
          background: checked
            ? "linear-gradient(135deg,#E0BE6F,#B68A2F)"
            : "rgba(255,255,255,0.1)",
        }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
          style={{ left: checked ? "22px" : "2px" }}
        />
      </span>
      {label && (
        <span className="text-sm font-body text-white/80 group-hover:text-white">
          {label}
        </span>
      )}
    </button>
  );
}

const btnVariants = {
  primary:
    "bg-gradient-to-br from-[#E0BE6F] to-[#B68A2F] text-black font-bold hover:shadow-[0_8px_25px_rgba(212,175,55,0.35)]",
  ghost:
    "border border-white/15 bg-white/[0.04] text-white/80 hover:border-[#D4AF37]/50 hover:text-white",
  danger:
    "border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20",
};

export function Btn({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${btnVariants[variant]} ${className}`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Spinner({ label = "Chargement..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-white/60">
      <Loader2 size={20} className="animate-spin" style={{ color: GOLD }} />
      <span className="font-body text-sm">{label}</span>
    </div>
  );
}

export function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-white/[0.06] text-white/70 border-white/10",
    gold: "bg-[#D4AF37]/10 text-[#E0BE6F] border-[#D4AF37]/30",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    red: "bg-red-500/10 text-red-300 border-red-500/30",
    blue: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 md:p-10"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${
          wide ? "max-w-4xl" : "max-w-2xl"
        } rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur px-6 py-4 rounded-t-2xl">
          <h2 className="font-display text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

export function Notice({ type = "info", children }) {
  const styles = {
    info: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    error: "border-red-500/30 bg-red-500/10 text-red-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  };
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm font-body ${styles[type]}`}
    >
      {children}
    </div>
  );
}
