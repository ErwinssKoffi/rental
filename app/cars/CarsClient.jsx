"use client";

import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import cars from "@/data/cars";
import CarCard from "@/components/cars/CarCard";
import FilterBar from "@/components/cars/FilterBar";

function CarsInner() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "all";

  const [filters, setFilters] = useState({
    type: typeParam,
    transmission: "all",
    fuelType: "all",
    maxPrice: 1000,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, type: typeParam }));
  }, [typeParam]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (filters.type !== "all" && car.type !== filters.type) return false;
      if (filters.transmission !== "all" && car.transmission !== filters.transmission) return false;
      if (filters.fuelType !== "all" && car.fuelType !== filters.fuelType) return false;
      if (car.pricePerDay > filters.maxPrice) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="bg-black min-h-screen overflow-x-hidden relative">

      {/* Background Cinematic Glow */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#D4AF37]/10 blur-[70px] pointer-events-none" />

      {/* Header Section */}
      <section className="relative z-10 text-center pb-16" style={{ paddingTop: "180px", marginBottom: "80px" }}>
        <span className="eyebrow">
          Premium Fleet
        </span>

        <h1 className="text-white text-5xl md:text-7xl font-bold mt-4 leading-tight">
          Discover Our Collection
        </h1>

        <div className="flex justify-center w-full mt-6">
          <p className="subtext max-w-3xl text-center text-lg">
            Discover our entire collection of premium vehicles.
            Use the filters to find the perfect match for your next journey.
          </p>
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-16 pl-24 pr-10 relative z-10 pb-32">
        {/* Sidebar / Filters */}
        <div className="w-[420px] ml-40">
          <div className="sticky top-28">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              total={cars.length}
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
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">No vehicles found</h3>
                <p className="text-platinum-400 font-body mb-6">
                  We couldn&apos;t find any vehicles matching your current filter criteria.
                </p>
                <button
                  onClick={() => setFilters({ type: "all", transmission: "all", fuelType: "all", maxPrice: 1000 })}
                  className="px-6 py-2.5 rounded-xl bg-gold text-obsidian-900 font-semibold font-body hover:bg-gold-light transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function CarsClient() {
  return (
    <Suspense fallback={
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl font-semibold animate-pulse">Loading fleet...</div>
      </div>
    }>
      <CarsInner />
    </Suspense>
  );
}
