"use client";

import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/cars/CarCard";
import FilterBar from "@/components/cars/FilterBar";

const BUSINESS_LINES = [
  { value: "all", label: "Tous" },
  { value: "rental", label: "Louer" },
  { value: "sale", label: "Acheter" },
];

function matchBusinessLine(car, line) {
  if (line === "all") return true;
  if (car.businessLine === "both") return true;
  return car.businessLine === line;
}

function CarsInner({ initialCars }) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "all";
  const lineParam = searchParams.get("line") || "all";

  const [line, setLine] = useState(
    BUSINESS_LINES.some((l) => l.value === lineParam) ? lineParam : "all"
  );
  const [filters, setFilters] = useState({
    type: typeParam,
    transmission: "all",
    fuelType: "all",
    maxPrice: 1000,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, type: typeParam }));
  }, [typeParam]);

  useEffect(() => {
    if (BUSINESS_LINES.some((l) => l.value === lineParam)) setLine(lineParam);
  }, [lineParam]);

  const filteredCars = useMemo(() => {
    return initialCars.filter((car) => {
      if (!matchBusinessLine(car, line)) return false;
      if (filters.type !== "all" && car.type !== filters.type) return false;
      if (filters.transmission !== "all" && car.transmission !== filters.transmission)
        return false;
      if (filters.fuelType !== "all" && car.fuelType !== filters.fuelType)
        return false;
      if (car.pricePerDay != null && car.pricePerDay > filters.maxPrice)
        return false;
      return true;
    });
  }, [initialCars, filters, line]);

  const resetAll = () => {
    setLine("all");
    setFilters({
      type: "all",
      transmission: "all",
      fuelType: "all",
      maxPrice: 1000,
    });
  };

  return (
    <div className="bg-black min-h-screen overflow-x-hidden relative">
      {/* Background Cinematic Glow */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#D4AF37]/10 blur-[70px] pointer-events-none" />

      {/* Header Section */}
      <section
        className="relative z-10 text-center pb-12"
        style={{ paddingTop: "180px", marginBottom: "60px" }}
      >
        <span className="eyebrow">Premium Fleet</span>

        <h1 className="text-white text-5xl md:text-7xl font-bold mt-4 leading-tight">
          Discover Our Collection
        </h1>

        <div className="flex justify-center w-full mt-6">
          <p className="subtext max-w-3xl text-center text-lg">
            Louez à la journée ou achetez votre prochain véhicule.
            Utilisez les filtres pour trouver la perle rare.
          </p>
        </div>

        {/* Onglets Louer / Acheter */}
        <div className="flex justify-center mt-10">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-full border border-white/10 bg-white/[0.03]">
            {BUSINESS_LINES.map((l) => (
              <button
                key={l.value}
                onClick={() => setLine(l.value)}
                className={`px-6 py-2.5 rounded-full font-body text-sm uppercase tracking-widest transition-all duration-300 ${
                  line === l.value
                    ? "bg-gradient-to-br from-[#D4AF37] to-[#F4D76B] text-black font-bold shadow-[0_8px_30px_rgba(212,175,55,0.3)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-16 pl-24 pr-10 relative z-10 pb-32">
        {/* Sidebar / Filters */}
        <div className="w-[420px] ml-40">
          <div className="sticky top-28">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              total={initialCars.length}
              filtered={filteredCars.length}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="w-full">
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="bg-graphite-700 border border-white/6 rounded-2xl p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-graphite-600 flex items-center justify-center text-platinum-400 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Aucun véhicule trouvé
              </h3>
              <p className="text-platinum-400 font-body mb-6">
                Aucun véhicule ne correspond à vos critères actuels.
              </p>
              <button
                onClick={resetAll}
                className="px-6 py-2.5 rounded-xl bg-gold text-obsidian-900 font-semibold font-body hover:bg-gold-light transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarsClient({ initialCars = [] }) {
  return (
    <Suspense
      fallback={
        <div className="bg-black min-h-screen flex items-center justify-center">
          <div className="text-[#D4AF37] text-xl font-semibold animate-pulse">
            Chargement de la flotte...
          </div>
        </div>
      }
    >
      <CarsInner initialCars={initialCars} />
    </Suspense>
  );
}
