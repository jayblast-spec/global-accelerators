"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, ExternalLink, FileText, Trash2, BookOpen } from "lucide-react";
import { useAccelStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ApplicationStatus } from "@/lib/types";
import { STATUS_LABELS, STATUS_COLORS, REGION_COLORS } from "@/lib/types";

const STATUS_ORDER: ApplicationStatus[] = [
  "interested",
  "researching",
  "applied",
  "interviewing",
  "accepted",
  "rejected",
];

export default function SavedPage() {
  const { savedAccelerators, updateStatus, updateNotes, unsaveAccelerator } = useAccelStore();
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);

  if (savedAccelerators.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <Bookmark size={28} style={{ color: "var(--accent-2)" }} />
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Your saved list is empty
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Save accelerators while browsing and track your applications here.
        </p>
        <Link href="/search">
          <Button>Find Accelerators</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>My List</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            {savedAccelerators.length} saved program{savedAccelerators.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/search">
          <Button variant="secondary" size="sm">Add More</Button>
        </Link>
      </div>

      {/* Status summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_ORDER.map(status => {
          const count = savedAccelerators.filter(s => s.status === status).length;
          if (!count) return null;
          return (
            <div
              key={status}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                backgroundColor: `${STATUS_COLORS[status]}15`,
                color: STATUS_COLORS[status],
                border: `1px solid ${STATUS_COLORS[status]}30`,
              }}
            >
              {STATUS_LABELS[status]}: {count}
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {savedAccelerators.map(item => {
          const regionColor = item.region ? (REGION_COLORS[item.region as keyof typeof REGION_COLORS] ?? "var(--muted)") : "var(--muted)";
          const isExpandingNotes = expandedNotes === item.acceleratorId;

          return (
            <div
              key={item.acceleratorId}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              {/* Header row */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {item.region && (
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: regionColor }}>
                        {item.region}
                      </span>
                    )}
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      Saved {new Date(item.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    href={`/accelerator/${item.acceleratorSlug}`}
                    className="font-semibold text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--foreground)" }}
                  >
                    {item.acceleratorName}
                  </Link>
                </div>
                <button
                  onClick={() => unsaveAccelerator(item.acceleratorId)}
                  className="shrink-0 p-1.5 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: "var(--muted)" }}
                  title="Remove from list"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Status tracker */}
              <div className="mb-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                  Status
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_ORDER.map(status => {
                    const active = item.status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => updateStatus(item.acceleratorId, status)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                        style={{
                          backgroundColor: active ? `${STATUS_COLORS[status]}20` : "var(--surface-2)",
                          color: active ? STATUS_COLORS[status] : "var(--muted)",
                          border: `1px solid ${active ? STATUS_COLORS[status] + "40" : "var(--border)"}`,
                        }}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                {isExpandingNotes ? (
                  <textarea
                    autoFocus
                    defaultValue={item.notes}
                    placeholder="Add notes about this application..."
                    rows={3}
                    className="w-full rounded-xl border px-3 py-2 text-xs outline-none transition-all resize-none"
                    style={{
                      backgroundColor: "var(--surface-2)",
                      borderColor: "var(--accent)",
                      color: "var(--foreground)",
                    }}
                    onBlur={e => {
                      updateNotes(item.acceleratorId, e.target.value);
                      setExpandedNotes(null);
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setExpandedNotes(item.acceleratorId)}
                    className="text-left w-full text-xs transition-opacity hover:opacity-80"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.notes
                      ? item.notes
                      : <span style={{ color: "var(--border)" }}>+ Add notes...</span>}
                  </button>
                )}
              </div>

              {/* Action links */}
              <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <Link href={`/accelerator/${item.acceleratorSlug}`}>
                  <button
                    className="flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-80"
                    style={{ color: "var(--accent-2)" }}
                  >
                    <ExternalLink size={11} />
                    View Profile
                  </button>
                </Link>
                <Link href={`/template/${item.acceleratorSlug}`}>
                  <button
                    className="flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-80"
                    style={{ color: "var(--muted)" }}
                  >
                    <FileText size={11} />
                    Template
                  </button>
                </Link>
                <Link href={`/apply/${item.acceleratorSlug}`}>
                  <button
                    className="flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-80"
                    style={{ color: "var(--muted)" }}
                  >
                    <BookOpen size={11} />
                    Guide
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
