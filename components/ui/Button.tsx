"use client";

import { forwardRef } from "react";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const styles: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-2 border-transparent",
  secondary: "bg-surface-2 text-foreground hover:bg-border border-border",
  ghost: "bg-transparent text-muted hover:text-foreground hover:bg-surface border-transparent",
  danger: "bg-danger/10 text-danger hover:bg-danger/20 border-danger/30",
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2 rounded-xl",
  lg: "h-11 px-6 text-sm gap-2 rounded-xl font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center font-medium border transition-all duration-150 cursor-pointer select-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          styles[variant],
          sizes[size],
          className,
        ].join(" ")}
        style={{
          backgroundColor: variant === "primary" ? "var(--accent)" : undefined,
          color: variant === "primary" ? "#fff" : undefined,
        }}
        {...props}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
