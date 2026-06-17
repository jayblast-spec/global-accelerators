import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ icon, className = "", ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3 pointer-events-none" style={{ color: "var(--muted)" }}>
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={`w-full h-10 rounded-xl border text-sm outline-none transition-all ${icon ? "pl-9" : "px-3"} pr-3 ${className}`}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
        onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";
