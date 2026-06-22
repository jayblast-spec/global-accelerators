"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Globe, DollarSign, Clock } from "lucide-react";
import { Badge } from "../ui/Badge";
import type { Accelerator } from "../../lib/types";
import { REGION_COLORS } from "../../lib/types";
import { useAccelStore } from "../../lib/store";
import { useToast } from "../ui/Toast";

export function AcceleratorCard({ accelerator: a, index = 0 }: { accelerator: Accelerator; index?: number }) {
  const { saveAccelerator, unsaveAccelerator, isSaved } = useAccelStore();
  const { success, info } = useToast();
  const saved = isSaved(a.id);

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (saved) {
      unsaveAccelerator(a.id);
      info("Removed", `${a.name} removed from your list.`);
    } else {
      saveAccelerator({ acceleratorId: a.id, acceleratorName: a.name, acceleratorSlug: a.slug, region: a.region ?? "" });
      success("Saved", `${a.name} added to your list.`);
    }
  }

  const score = a.diligence_score ?? 5;
  const scoreColor = score >= 8 ? "var(--success)" : score >= 6 ? "var(--gold)" : score >= 4 ? "var(--warn)" : "var(--danger)";
  const regionColor = a.region ? REGION_COLORS[a.region] : "var(--muted)";

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link href={`/accelerator/${a.slug}`} className="block group">
        <div
          className="rounded-xl border p-5 transition-all duration-150 cursor-pointer h-full flex flex-col"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-glass)",
            backdropFilter: "blur(20px)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.3)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 24px rgba(99,102,241,0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-glass)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3
                  className="text-sm font-semibold truncate"
                  style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
                >
                  {a.name}
                </h3>
                {a.is_verified && <Badge variant="success">Verified</Badge>}
                {!a.is_active && <Badge variant="warn">Inactive</Badge>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {a.region && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: regionColor, fontFamily: "var(--font-mono)" }}
                  >
                    {a.region}
                  </span>
                )}
                {a.country && a.region !== "Global" && (
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>· {a.country}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border-2"
                style={{
                  borderColor: scoreColor,
                  color: scoreColor,
                  backgroundColor: `${scoreColor}15`,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {score}
              </div>
              <button
                onClick={toggleSave}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all border"
                style={{
                  borderColor: saved ? "rgba(99,102,241,0.4)" : "var(--border-glass)",
                  backgroundColor: saved ? "var(--accent-soft)" : "transparent",
                  color: saved ? "var(--accent-2)" : "var(--muted)",
                }}
              >
                {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
              </button>
            </div>
          </div>

          {a.tagline && (
            <p className="text-[12px] leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--muted)" }}>
              {a.tagline}
            </p>
          )}

          {a.focus_areas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {a.focus_areas.slice(0, 3).map(f => (
                <Badge key={f} variant="accent">{f}</Badge>
              ))}
              {a.focus_areas.length > 3 && (
                <Badge variant="muted">+{a.focus_areas.length - 3}</Badge>
              )}
            </div>
          )}

          <div
            className="flex items-center gap-3 mt-auto pt-3 border-t flex-wrap"
            style={{ borderColor: "var(--border-glass)" }}
          >
            {a.funding_amount_usd !== null && a.funding_amount_usd > 0 && (
              <div className="flex items-center gap-1">
                <DollarSign size={10} style={{ color: "var(--success)" }} />
                <span className="text-[11px] font-semibold" style={{ color: "var(--success)", fontFamily: "var(--font-mono)" }}>
                  ${a.funding_amount_usd >= 1000000
                    ? `${(a.funding_amount_usd / 1000000).toFixed(1)}M`
                    : `${(a.funding_amount_usd / 1000).toFixed(0)}K`}
                </span>
              </div>
            )}
            {a.equity_percentage !== null && (
              <span className="text-[11px]" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {a.equity_percentage}% equity
              </span>
            )}
            {a.program_duration_weeks !== null && (
              <div className="flex items-center gap-1">
                <Clock size={10} style={{ color: "var(--muted)" }} />
                <span className="text-[11px]" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                  {a.program_duration_weeks}w
                </span>
              </div>
            )}
            {a.batch_frequency && (
              <span className="text-[11px]" style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {a.batch_frequency}
              </span>
            )}
            {a.remote_friendly && (
              <div className="flex items-center gap-1 ml-auto">
                <Globe size={10} style={{ color: "var(--secondary)" }} />
                <span className="text-[11px]" style={{ color: "var(--secondary)", fontFamily: "var(--font-mono)" }}>
                  Remote OK
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}