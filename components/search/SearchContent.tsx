"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, ChevronDown, SlidersHorizontal, Check } from "lucide-react";
import { AcceleratorCard } from "@/components/accelerators/AcceleratorCard";
import { AcceleratorCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import type { Accelerator } from "@/lib/types";
import { REGIONS, STAGES, FOCUS_AREAS } from "@/lib/types";

const PER_PAGE = 24;

export function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [results, setResults] = useState<Accelerator[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  const q = searchParams.get("q") ?? "";
  const region = searchParams.get("region") ?? "";
  const stage = searchParams.get("stage") ?? "";
  const focus = searchParams.get("focus") ?? "";
  const verified = searchParams.get("verified") === "true";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v); else params.delete(k);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
      setOpenDropdown(null);
    },
    [searchParams, pathname, router]
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (region) params.set("region", region);
    if (stage) params.set("stage", stage);
    if (focus) params.set("focus", focus);
    if (verified) params.set("verified", "true");
    params.set("page", String(page));
    params.set("limit", String(PER_PAGE));

    fetch(`/api/accelerators?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setResults(data.data ?? []);
          setTotal(data.total ?? 0);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [q, region, stage, focus, verified, page]);

  useEffect(() => { setPage(0); }, [q, region, stage, focus, verified]);

  useEffect(() => {
    if (searchRef.current && searchRef.current.value !== q) {
      searchRef.current.value = q;
    }
  }, [q]);

  let debounceTimer: ReturnType<typeof setTimeout>;
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    clearTimeout(debounceTimer);
    const val = e.target.value;
    debounceTimer = setTimeout(() => updateParams({ q: val.trim() }), 500);
  }

  const activeFilterCount = [region, stage, focus, verified ? "v" : ""].filter(Boolean).length;
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="min-h-screen">

      {/* ── Search + Filter bar ── */}
      <div
        className="sticky top-14 z-30 border-b"
        style={{ backgroundColor: "rgba(6,7,15,0.95)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-2.5">

          {/* Search input */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted)" }} />
            <input
              ref={searchRef}
              type="text"
              defaultValue={q}
              placeholder="Search by name, country, focus area…"
              className="w-full h-10 rounded-xl border pl-10 pr-4 text-sm outline-none transition-all"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              onChange={handleSearchChange}
              onKeyDown={e => { if (e.key === "Enter") { clearTimeout(debounceTimer); updateParams({ q: e.currentTarget.value.trim() }); } }}
            />
          </div>

          {/* Desktop filter bar */}
          <div ref={filterBarRef} className="hidden md:flex items-center gap-2 flex-wrap">

            {/* Region dropdown */}
            <FilterDropdown
              label="Region"
              value={region}
              open={openDropdown === "region"}
              onToggle={() => setOpenDropdown(openDropdown === "region" ? null : "region")}
              onClear={() => updateParams({ region: "" })}
            >
              <DropdownOption label="All Regions" active={!region} onClick={() => updateParams({ region: "" })} />
              {REGIONS.map(r => (
                <DropdownOption key={r} label={r} active={region === r} onClick={() => updateParams({ region: region === r ? "" : r })} />
              ))}
            </FilterDropdown>

            {/* Stage dropdown */}
            <FilterDropdown
              label="Stage"
              value={stage}
              open={openDropdown === "stage"}
              onToggle={() => setOpenDropdown(openDropdown === "stage" ? null : "stage")}
              onClear={() => updateParams({ stage: "" })}
            >
              <DropdownOption label="Any Stage" active={!stage} onClick={() => updateParams({ stage: "" })} />
              {STAGES.map(s => (
                <DropdownOption key={s} label={s} active={stage === s} onClick={() => updateParams({ stage: stage === s ? "" : s })} />
              ))}
            </FilterDropdown>

            {/* Focus Area dropdown */}
            <FilterDropdown
              label="Focus"
              value={focus}
              open={openDropdown === "focus"}
              onToggle={() => setOpenDropdown(openDropdown === "focus" ? null : "focus")}
              onClear={() => updateParams({ focus: "" })}
            >
              <DropdownOption label="Any Focus" active={!focus} onClick={() => updateParams({ focus: "" })} />
              {FOCUS_AREAS.filter(f => f !== "Any").map(f => (
                <DropdownOption key={f} label={f} active={focus === f} onClick={() => updateParams({ focus: focus === f ? "" : f })} />
              ))}
            </FilterDropdown>

            {/* Verified toggle pill */}
            <button
              onClick={() => updateParams({ verified: verified ? "" : "true" })}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-all"
              style={{
                borderColor: verified ? "rgba(52,211,153,0.4)" : "var(--border)",
                backgroundColor: verified ? "rgba(52,211,153,0.08)" : "var(--surface)",
                color: verified ? "var(--success)" : "var(--muted)",
              }}
            >
              {verified && <Check size={11} />}
              Verified only
            </button>

            {/* Clear all — only when filters active */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => router.push("/search")}
                className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs transition-all hover:opacity-80"
                style={{ color: "var(--muted)" }}
              >
                <X size={11} />
                Clear all
              </button>
            )}

            {/* Results count right-aligned */}
            <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>
              {loading ? "Searching…" : `${total.toLocaleString()} program${total !== 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Mobile filter button */}
          <div className="flex md:hidden items-center justify-between">
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {loading ? "Searching…" : `${total.toLocaleString()} programs`}
            </span>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium"
              style={{
                borderColor: activeFilterCount > 0 ? "var(--accent)" : "var(--border)",
                color: activeFilterCount > 0 ? "var(--accent-2)" : "var(--muted)",
                backgroundColor: activeFilterCount > 0 ? "rgba(99,102,241,0.08)" : "var(--surface)",
              }}
            >
              <SlidersHorizontal size={13} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* ── Results grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => <AcceleratorCardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>No programs found</p>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>Try different filters or a broader search term</p>
            <button onClick={() => router.push("/search")} className="text-xs underline" style={{ color: "var(--accent-2)" }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {results.map((a, i) => <AcceleratorCard key={a.id} accelerator={a} index={i} />)}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
                  Previous
                </Button>
                <span className="text-xs" style={{ color: "var(--muted)" }}>{page + 1} / {totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilters && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setShowMobileFilters(false)} />
          <div
            className="md:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t shadow-2xl overflow-y-auto max-h-[85vh]"
            style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
          >
            <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b" style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}>
              <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>Filters</span>
              <button onClick={() => setShowMobileFilters(false)}><X size={18} style={{ color: "var(--muted)" }} /></button>
            </div>
            <div className="p-5 space-y-6 pb-10">
              <MobileFilterSection title="Region">
                <MobileFilterOption label="All Regions" active={!region} onClick={() => { updateParams({ region: "" }); setShowMobileFilters(false); }} />
                {REGIONS.map(r => <MobileFilterOption key={r} label={r} active={region === r} onClick={() => { updateParams({ region: region === r ? "" : r }); setShowMobileFilters(false); }} />)}
              </MobileFilterSection>
              <MobileFilterSection title="Stage">
                <MobileFilterOption label="Any Stage" active={!stage} onClick={() => { updateParams({ stage: "" }); setShowMobileFilters(false); }} />
                {STAGES.map(s => <MobileFilterOption key={s} label={s} active={stage === s} onClick={() => { updateParams({ stage: stage === s ? "" : s }); setShowMobileFilters(false); }} />)}
              </MobileFilterSection>
              <MobileFilterSection title="Focus Area">
                <MobileFilterOption label="Any Focus" active={!focus} onClick={() => { updateParams({ focus: "" }); setShowMobileFilters(false); }} />
                {FOCUS_AREAS.filter(f => f !== "Any").map(f => <MobileFilterOption key={f} label={f} active={focus === f} onClick={() => { updateParams({ focus: focus === f ? "" : f }); setShowMobileFilters(false); }} />)}
              </MobileFilterSection>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Verified only</span>
                <button
                  onClick={() => { updateParams({ verified: verified ? "" : "true" }); setShowMobileFilters(false); }}
                  className="rounded-full transition-all relative shrink-0"
                  style={{ width: "40px", height: "22px", backgroundColor: verified ? "var(--accent)" : "var(--border)" }}
                >
                  <div className="absolute top-1 rounded-full transition-all" style={{ width: "14px", height: "14px", backgroundColor: "white", left: verified ? "22px" : "4px" }} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Desktop dropdown filter ── */
function FilterDropdown({
  label, value, open, onToggle, onClear, children,
}: {
  label: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  onClear: () => void;
  children: React.ReactNode;
}) {
  const isActive = !!value;
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-all"
        style={{
          borderColor: isActive ? "rgba(99,102,241,0.5)" : "var(--border)",
          backgroundColor: isActive ? "rgba(99,102,241,0.1)" : "var(--surface)",
          color: isActive ? "var(--accent-2)" : "var(--muted)",
        }}
      >
        <span>{isActive ? value : label}</span>
        {isActive
          ? <X size={11} onClick={e => { e.stopPropagation(); onClear(); }} />
          : <ChevronDown size={11} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
        }
      </button>

      {open && (
        <div
          className="absolute top-10 left-0 z-50 rounded-xl border shadow-2xl py-1.5 min-w-[160px] max-h-64 overflow-y-auto"
          style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 text-xs transition-all hover:opacity-80"
      style={{
        color: active ? "var(--foreground)" : "var(--muted)",
        backgroundColor: active ? "rgba(99,102,241,0.08)" : "transparent",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
      {active && <Check size={11} style={{ color: "var(--accent-2)", flexShrink: 0 }} />}
    </button>
  );
}

/* ── Mobile filter helpers ── */
function MobileFilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function MobileFilterOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
      style={{
        borderColor: active ? "rgba(99,102,241,0.4)" : "var(--border)",
        backgroundColor: active ? "rgba(99,102,241,0.1)" : "var(--surface)",
        color: active ? "var(--accent-2)" : "var(--muted)",
      }}
    >
      {label}
    </button>
  );
}
