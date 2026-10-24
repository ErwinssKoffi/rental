import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gold-gradient text-obsidian-900 font-semibold hover:opacity-90 hover:scale-[1.02] shadow-gold active:scale-[0.98]",
  secondary:
    "bg-transparent border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold active:scale-[0.98]",
  ghost:
    "bg-transparent text-platinum-200 hover:text-white hover:bg-white/5 active:scale-[0.98]",
  outline:
    "bg-transparent border border-white/15 text-platinum-200 hover:border-white/40 hover:text-white active:scale-[0.98]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
  xl: "px-10 py-5 text-lg rounded-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  disabled,
  onClick,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
