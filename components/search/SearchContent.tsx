"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
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
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const q = searchParams.get("q") ?? "";
  const region = searchParams.get("region") ?? "";
  const stage = searchParams.get("stage") ?? "";
  const focus = searchParams.get("focus") ?? "";
  const verified = searchParams.get("verified") === "true";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

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
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q, region, stage, focus, verified, page]);

  useEffect(() => {
    setPage(0);
  }, [q, region, stage, focus, verified]);

  // Sync search input with URL
  useEffect(() => {
    if (searchRef.current && searchRef.current.value !== q) {
      searchRef.current.value = q;
    }
  }, [q]);

  const activeFilters = [
    q && { key: "q", label: `"${q}"` },
    region && { key: "region", label: region },
    stage && { key: "stage", label: stage },
    focus && { key: "focus", label: focus },
    verified && { key: "verified", label: "Verified only" },
  ].filter(Boolean) as { key: string; label: string }[];

  const totalPages = Math.ceil(total / PER_PAGE);

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      updateParams({ q: e.currentTarget.value.trim() });
    }
  }

  let debounceTimer: ReturnType<typeof setTimeout>;
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    clearTimeout(debounceTimer);
    const val = e.target.value;
    debounceTimer = setTimeout(() => updateParams({ q: val.trim() }), 600);
  }

  return (
    <div className="min-h-screen">
      {/* Sticky search bar */}
      <div
        className="sticky top-14 z-30 border-b py-3 px-4 sm:px-6"
        style={{
          backgroundColor: "rgba(6,7,15,0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--muted)" }}
            />
            <input
              ref={searchRef}
              type="text"
              defaultValue={q}
              placeholder="Search programs, countries, focus areas..."
              className="w-full h-9 rounded-xl border pl-9 pr-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              onKeyDown={handleSearchKeyDown}
              onChange={handleSearchChange}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-medium transition-all md:hidden shrink-0"
            style={{
              borderColor: showFilters ? "var(--accent)" : "var(--border)",
              color: showFilters ? "var(--accent-2)" : "var(--muted)",
              backgroundColor: showFilters ? "rgba(99,102,241,0.08)" : "var(--surface)",
            }}
          >
            <SlidersHorizontal size={13} />
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 mt-2">
            {activeFilters.map(f => (
              <button
                key={f.key}
                onClick={() => updateParams({ [f.key]: "" })}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: "rgba(99,102,241,0.12)",
                  color: "var(--accent-2)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                {f.label}
                <X size={9} />
              </button>
            ))}
            <button
              onClick={() => router.push("/search")}
              className="text-[11px] transition-colors hover:opacity-70"
              style={{ color: "var(--muted)" }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden md:block w-52 shrink-0">
          <FilterPanel
            region={region}
            stage={stage}
            focus={focus}
            verified={verified}
            onUpdate={updateParams}
          />
        </aside>

        {/* Mobile filter drawer */}
        {showFilters && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setShowFilters(false)}
            />
            <div
              className="md:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t shadow-2xl p-5 pb-10 overflow-y-auto max-h-[80vh]"
              style={{ backgroundColor: "var(--surface-2)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  Filters
                </span>
                <button onClick={() => setShowFilters(false)}>
                  <X size={18} style={{ color: "var(--muted)" }} />
                </button>
              </div>
              <FilterPanel
                region={region}
                stage={stage}
                focus={focus}
                verified={verified}
                onUpdate={p => {
                  updateParams(p);
                  setShowFilters(false);
                }}
              />
            </div>
          </>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {loading
                ? "Searching..."
                : `${total.toLocaleString()} program${total !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <AcceleratorCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>
                No programs found
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Try different filters or search terms
              </p>
              <button
                onClick={() => router.push("/search")}
                className="mt-4 text-xs underline"
                style={{ color: "var(--accent-2)" }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((a, i) => (
                  <AcceleratorCard key={a.id} accelerator={a} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  region,
  stage,
  focus,
  verified,
  onUpdate,
}: {
  region: string;
  stage: string;
  focus: string;
  verified: boolean;
  onUpdate: (updates: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-6">
      <FilterSection title="Region">
        <FilterOption label="All Regions" active={!region} onClick={() => onUpdate({ region: "" })} />
        {REGIONS.map(r => (
          <FilterOption
            key={r}
            label={r}
            active={region === r}
            onClick={() => onUpdate({ region: region === r ? "" : r })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Stage">
        <FilterOption label="Any Stage" active={!stage} onClick={() => onUpdate({ stage: "" })} />
        {STAGES.map(s => (
          <FilterOption
            key={s}
            label={s}
            active={stage === s}
            onClick={() => onUpdate({ stage: stage === s ? "" : s })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Focus Area">
        <FilterOption label="Any Focus" active={!focus} onClick={() => onUpdate({ focus: "" })} />
        {FOCUS_AREAS.filter(f => f !== "Any").map(f => (
          <FilterOption
            key={f}
            label={f}
            active={focus === f}
            onClick={() => onUpdate({ focus: focus === f ? "" : f })}
          />
        ))}
      </FilterSection>

      <div>
        <button
          onClick={() => onUpdate({ verified: verified ? "" : "true" })}
          className="flex items-center gap-2.5 w-full text-left"
        >
          <div
            className="rounded-full transition-all shrink-0 relative"
            style={{
              width: "32px",
              height: "18px",
              backgroundColor: verified ? "var(--accent)" : "var(--border)",
            }}
          >
            <div
              className="absolute top-0.5 rounded-full transition-all"
              style={{
                width: "14px",
                height: "14px",
                backgroundColor: "white",
                left: verified ? "16px" : "2px",
              }}
            />
          </div>
          <span className="text-xs" style={{ color: "var(--foreground)" }}>
            Verified only
          </span>
        </button>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
        style={{ color: "var(--muted)" }}
      >
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all"
      style={{
        color: active ? "var(--foreground)" : "var(--muted)",
        backgroundColor: active ? "var(--surface-2)" : "transparent",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}
