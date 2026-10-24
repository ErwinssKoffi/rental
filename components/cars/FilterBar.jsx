"use client";

import { useState } from "react";
import { CAR_TYPES, TRANSMISSIONS, FUEL_TYPES } from "@/lib/utils";
import { FaCar, FaCogs, FaGasPump, FaDollarSign, FaRedo } from "react-icons/fa";

const FilterChip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-full font-body text-[15px] font-semibold transition-all duration-300 whitespace-nowrap tracking-wide flex items-center justify-center ${active
        ? "text-[#050505] shadow-[0_4px_15px_rgba(201,168,76,0.25)]"
        : "bg-white/[0.03] text-white/50 border border-white/10 hover:border-[#c9a84c]/50 hover:text-white hover:bg-white/[0.05]"
      }`}
    style={{
      background: active ? "linear-gradient(135deg, #c9a84c, #e9c15f)" : "",
    }}
  >
    {children}
  </button>
);

export default function FilterBar({ filters, onChange, total, filtered }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="backdrop-blur-xl border border-white/8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-[36px] bg-[#070707]/95 space-y-6 max-w-full" style={{ paddingTop: '40px', paddingBottom: '40px', paddingLeft: '40px', paddingRight: '40px' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div className="space-y-2">
          <h2 className="font-display font-bold text-white text-3xl tracking-tight">Filters</h2>
          <p className="text-sm font-body text-white/40 flex items-center gap-1.5">
            Showing <span className="text-[#c9a84c] font-semibold">{filtered}</span> of <span className="text-white/60">{total}</span> vehicles
          </p>
        </div>
        <button
          onClick={() =>
            onChange({ type: "all", transmission: "all", fuelType: "all", maxPrice: 1000 })
          }
          className="text-xs font-body font-bold text-[#c9a84c] hover:text-[#e9c15f] transition-colors flex items-center gap-2 group tracking-wider"
        >
          <FaRedo className="text-[10px] group-hover:rotate-180 transition-transform duration-500" />
          RESET ALL
        </button>
      </div>

      {/* ── Vehicle Type ── */}
      <div className="space-y-5 pt-8">
        <p className="text-[12px] tracking-[0.25em] uppercase text-white/30 font-bold flex items-center gap-2.5">
          <FaCar className="text-[#c9a84c]/60 text-sm" />
          Vehicle Type
        </p>
        <div className="flex flex-col gap-3">
          {CAR_TYPES.map((t) => (
            <FilterChip
              key={t.value}
              active={filters.type === t.value}
              onClick={() => set("type", t.value)}
            >
              {t.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ── Transmission ── */}
      <div className="space-y-5 pt-8 border-t border-white/5">
        <p className="text-[12px] tracking-[0.25em] uppercase text-white/30 font-bold flex items-center gap-2.5">
          <FaCogs className="text-[#c9a84c]/60 text-sm" />
          Transmission
        </p>
        <div className="flex flex-col gap-3">
          {TRANSMISSIONS.map((t) => (
            <FilterChip
              key={t.value}
              active={filters.transmission === t.value}
              onClick={() => set("transmission", t.value)}
            >
              {t.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ── Fuel Type ── */}
      <div className="space-y-5 pt-8 border-t border-white/5">
        <p className="text-[12px] tracking-[0.25em] uppercase text-white/30 font-bold flex items-center gap-2.5">
          <FaGasPump className="text-[#c9a84c]/60 text-sm" />
          Fuel Type
        </p>
        <div className="flex flex-col gap-3">
          {FUEL_TYPES.map((f) => (
            <FilterChip
              key={f.value}
              active={filters.fuelType === f.value}
              onClick={() => set("fuelType", f.value)}
            >
              {f.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* ── Price Range ── */}
      <div className="space-y-5 pt-8 border-t border-white/5">
        <div className="flex items-center justify-between">
          <p className="text-[12px] tracking-[0.25em] uppercase text-white/30 font-bold flex items-center gap-2.5">
            <FaDollarSign className="text-[#c9a84c]/60 text-sm" />
            Max Price / Day
          </p>
          <span className="text-lg font-body font-bold text-[#c9a84c]">
            ${filters.maxPrice === 1000 ? "1,000+" : filters.maxPrice}
          </span>
        </div>

        <div className="relative pt-2">
          <input
            type="range"
            min={50}
            max={1000}
            step={25}
            value={filters.maxPrice}
            onChange={(e) => set("maxPrice", Number(e.target.value))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c9a84c] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(201,168,76,0.8)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#c9a84c] [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(201,168,76,0.8)]"
            style={{
              background: `linear-gradient(to right, #c9a84c ${((filters.maxPrice - 50) / 950) * 100}%, rgba(255,255,255,0.05) ${((filters.maxPrice - 50) / 950) * 100}%)`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-white/30 font-body">
          <span>$50</span>
          <span>$1,000+</span>
        </div>
      </div>

      {/* ── Active filter summary ── */}
      {(filters.type !== "all" || filters.transmission !== "all" || filters.fuelType !== "all" || filters.maxPrice < 1000) && (
        <div className="pt-6 border-t border-white/5 space-y-3">
          <p className="text-[12px] tracking-[0.1em] uppercase text-white/30 font-bold">Active filters:</p>
          <div className="flex flex-wrap gap-2.5">
            {filters.type !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-medium">
                {CAR_TYPES.find((t) => t.value === filters.type)?.label}
                <button onClick={() => set("type", "all")} className="hover:text-white transition-colors ml-0.5">×</button>
              </span>
            )}
            {filters.transmission !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-medium">
                {TRANSMISSIONS.find((t) => t.value === filters.transmission)?.label}
                <button onClick={() => set("transmission", "all")} className="hover:text-white transition-colors ml-0.5">×</button>
              </span>
            )}
            {filters.fuelType !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-medium">
                {FUEL_TYPES.find((f) => f.value === filters.fuelType)?.label}
                <button onClick={() => set("fuelType", "all")} className="hover:text-white transition-colors ml-0.5">×</button>
              </span>
            )}
            {filters.maxPrice < 1000 && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-medium">
                Up to ${filters.maxPrice}
                <button onClick={() => set("maxPrice", 1000)} className="hover:text-white transition-colors ml-0.5">×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
