import { cn, TYPE_LABELS } from "@/lib/utils";

const badgeStyles = {
  available: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  unavailable: "bg-red-500/15 text-red-400 border border-red-500/25",
  economy: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  suv: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  luxury: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  sports: "bg-red-500/15 text-red-400 border border-red-500/25",
  electric: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
  petrol: "bg-orange-500/15 text-orange-400 border border-orange-500/25",
  diesel: "bg-gray-500/15 text-gray-400 border border-gray-500/25",
  automatic: "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  manual: "bg-pink-500/15 text-pink-400 border border-pink-500/25",
  featured: "bg-gold/15 text-gold border border-gold/25",
};

export default function Badge({ variant = "available", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold font-body tracking-wide uppercase",
        badgeStyles[variant] ?? "bg-white/10 text-white/60 border border-white/10",
        className
      )}
    >
      {children}
    </span>
  );
}

export function AvailabilityBadge({ available }) {
  return (
    <Badge variant={available ? "available" : "unavailable"}>
      <span
        className={cn(
          "mr-1.5 w-1.5 h-1.5 rounded-full inline-block",
          available ? "bg-emerald-400" : "bg-red-400"
        )}
      />
      {available ? "Available" : "Unavailable"}
    </Badge>
  );
}

export function TypeBadge({ type }) {
  return <Badge variant={type}>{TYPE_LABELS[type] ?? type}</Badge>;
}
