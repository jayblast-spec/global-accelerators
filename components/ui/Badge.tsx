import type { ReactNode } from "react";

type Variant = "default" | "accent" | "gold" | "success" | "warn" | "danger" | "muted";

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const styles: Record<Variant, { bg: string; color: string; border: string }> = {
  default: { bg: "var(--surface-2)", color: "var(--foreground)", border: "var(--border)" },
  accent: { bg: "var(--accent-soft)", color: "var(--accent-2)", border: "rgba(99,102,241,0.3)" },
  gold: { bg: "var(--gold-soft)", color: "var(--gold)", border: "rgba(212,168,83,0.3)" },
  success: { bg: "var(--success-soft)", color: "var(--success)", border: "rgba(52,211,153,0.3)" },
  warn: { bg: "var(--warn-soft)", color: "var(--warn)", border: "rgba(251,191,36,0.3)" },
  danger: { bg: "var(--danger-soft)", color: "var(--danger)", border: "rgba(248,113,113,0.3)" },
  muted: { bg: "transparent", color: "var(--muted)", border: "var(--border)" },
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  const s = styles[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${className}`}
      style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
    >
      {children}
    </span>
  );
}
