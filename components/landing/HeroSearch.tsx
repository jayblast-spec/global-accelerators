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
          placeholder="Y Combinator, cleantech, Nigeria, seed stage..."
          className="w-full h-14 rounded-2xl border pl-12 pr-32 text-sm outline-none transition-all"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          className="absolute right-2 h-10 px-5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "white" }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
