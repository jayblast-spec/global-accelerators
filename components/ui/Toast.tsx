"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
type Toast = { id: string; type: ToastType; title: string; message?: string };

const ToastCtx = createContext<{
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, type, title, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), []);

  const value = {
    success: (t: string, m?: string) => add("success", t, m),
    error: (t: string, m?: string) => add("error", t, m),
    info: (t: string, m?: string) => add("info", t, m),
  };

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: { icon: "var(--success)", bg: "var(--success-soft)", border: "rgba(52,211,153,0.2)" },
    error: { icon: "var(--danger)", bg: "var(--danger-soft)", border: "rgba(248,113,113,0.2)" },
    info: { icon: "var(--accent-2)", bg: "var(--accent-soft)", border: "rgba(99,102,241,0.2)" },
  };

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = icons[t.type];
            const c = colors[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 48, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 48, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto rounded-xl border p-3.5 shadow-xl flex items-start gap-3"
                style={{ backgroundColor: "var(--surface)", borderColor: c.border }}
              >
                <Icon size={16} style={{ color: c.icon, flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{t.title}</p>
                  {t.message && <p className="text-[11px] text-muted mt-0.5">{t.message}</p>}
                </div>
                <button onClick={() => remove(t.id)} className="text-muted hover:text-foreground transition-colors cursor-pointer">
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
