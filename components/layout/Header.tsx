"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bookmark, User, Globe } from "lucide-react";
import { Button } from "../ui/Button";

const NAV = [
  { href: "/search", label: "Find Accelerators", icon: Search },
  { href: "/saved", label: "My List", icon: Bookmark },
  { href: "/profile", label: "My Startup", icon: User },
];

export function Header() {
  const path = usePathname();

  return (
    <>
      {/* Top header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ backgroundColor: "rgba(6,7,15,0.92)", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-soft)", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              <Globe size={14} style={{ color: "var(--accent-2)" }} />
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: "var(--foreground)" }}>
              Global Accelerators
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label }) => {
              const active = path === href || path.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    color: active ? "var(--foreground)" : "var(--muted)",
                    backgroundColor: active ? "var(--surface-2)" : "transparent",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <Link href="/search" className="hidden md:block">
            <Button size="sm">Find Accelerators</Button>
          </Link>
        </div>
      </header>

      {/* Mobile bottom nav — fixed to bottom of screen */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden border-t z-50"
        style={{
          backgroundColor: "rgba(6,7,15,0.97)",
          borderColor: "var(--border)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-all"
              style={{ color: active ? "var(--accent-2)" : "var(--muted)" }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
