"use client";

import { useState } from "react";
import { UserPlus, Briefcase } from "lucide-react";
import LeadsManager from "./LeadsManager";
import SalesManager from "./SalesManager";

const VIEWS = [
  { id: "pipeline", label: "Pipeline de vente", icon: Briefcase },
  { id: "leads", label: "Prospects", icon: UserPlus },
];

export default function SalesDashboard() {
  const [view, setView] = useState("pipeline");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-white/10">
        {VIEWS.map((v) => {
          const Icon = v.icon;
          const active = view === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[12px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
                active
                  ? "border-[#D4AF37] text-[#E0BE6F]"
                  : "border-transparent text-white/45 hover:text-white"
              }`}
            >
              <Icon size={15} />
              {v.label}
            </button>
          );
        })}
      </div>

      {view === "pipeline" ? <SalesManager /> : <LeadsManager />}
    </div>
  );
}
