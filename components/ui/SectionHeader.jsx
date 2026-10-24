import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  heading,
  subtext,
  align = "center",
  light = false,
  className,
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "w-full mx-auto text-center flex flex-col items-center",
        align === "left" && "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-4 font-body">
          <span className="block w-8 h-px bg-gold-gradient opacity-80" />
          {eyebrow}
          <span className="block w-8 h-px bg-gold-gradient opacity-80" />
        </p>
      )}
      <h2
        className={cn(
          "font-display font-bold leading-tight tracking-tight",
          light ? "text-white" : "text-white",
          align === "center" && "text-center"
        )}
        style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
      >
        {heading}
      </h2>
      {subtext && (
        <p
          className={cn(
            "mt-5 text-base sm:text-lg leading-relaxed font-body",
            light ? "text-platinum-400" : "text-platinum-400",
            align === "center" && "text-center"
          )}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
