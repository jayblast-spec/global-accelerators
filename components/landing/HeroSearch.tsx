"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-4 pointer-events-none"
          style={{ color: "var(--muted)" }}
        />
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="search accelerators, regions, stage..."
          className="hero-search-input w-full h-14 rounded-lg border pl-12 pr-32 outline-none transition-all"
          style={{
            backgroundColor: "rgba(15,17,26,0.9)",
            backdropFilter: "blur(20px)",
            borderColor: "var(--border-glass)",
            color: "var(--foreground)",
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = "rgba(76,215,246,0.5)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(76,215,246,0.08)";
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = "var(--border-glass)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          className="absolute right-2 h-10 px-5 rounded text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--accent)",
            color: "white",
            fontFamily: "var(--font-body)",
          }}
        >
          Search
        </button>
      </div>
    </form>
  );
}