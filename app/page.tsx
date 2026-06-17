import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Globe, Shield, FileText, ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import { HeroSearch } from "@/components/landing/HeroSearch";
import { AcceleratorCard } from "@/components/accelerators/AcceleratorCard";
import { Button } from "@/components/ui/Button";
import type { Accelerator } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const REGION_EMOJIS: Record<string, string> = {
  "North America": "🌎",
  "Europe": "🌍",
  "Africa": "🌍",
  "Asia Pacific": "🌏",
  "LATAM": "🌎",
  "MENA": "🌙",
  "Global": "🌐",
};

const REGION_DESC: Record<string, string> = {
  "North America": "YC, Techstars, 500 Global, Alchemist and more",
  "Europe": "Seedcamp, EF, Antler, Station F, EIC and more",
  "Africa": "TEF, MEST, CcHub, Founders Factory and more",
  "Asia Pacific": "Sequoia Surge, Antler, Startmate, T-Hub and more",
  "LATAM": "Startup Chile, 500 Mexico, ACE, Wayra and more",
  "MENA": "Hub71, Flat6Labs, Sheraa, 500 MENA and more",
  "Global": "Google, Microsoft, SAP.iO, Nvidia Inception and more",
};

const ALL_REGIONS = ["North America", "Europe", "Africa", "Asia Pacific", "LATAM", "MENA", "Global"];

export default async function HomePage() {
  const [totalRes, byRegionRes, featuredRes] = await Promise.all([
    supabase.from("accelerators").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("accelerators").select("region").eq("is_active", true),
    supabase
      .from("accelerators")
      .select("*")
      .eq("is_active", true)
      .order("diligence_score", { ascending: false })
      .limit(8),
  ]);

  const total = totalRes.count ?? 164;
  const regionCounts = (
    (byRegionRes.data ?? []) as { region: string | null }[]
  ).reduce((acc: Record<string, number>, r) => {
    if (r.region) acc[r.region] = (acc[r.region] ?? 0) + 1;
    return acc;
  }, {});
  const featured = (featuredRes.data ?? []) as Accelerator[];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -top-20 -right-40 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--accent-2) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-24 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-8 text-[11px] font-semibold uppercase tracking-widest"
            style={{
              borderColor: "rgba(99,102,241,0.3)",
              backgroundColor: "rgba(99,102,241,0.08)",
              color: "var(--accent-2)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {total}+ Global Accelerators — Verified
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            style={{ color: "var(--foreground)" }}
          >
            Every accelerator on Earth.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent-2) 0%, var(--gold) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Verified.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            The definitive global accelerator database. Search and apply to {total}+ verified programs
            across 7 regions — with due diligence reports and AI-generated application templates.
          </p>

          <HeroSearch />

          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {["Y Combinator", "Techstars", "Antler", "Hub71", "Tony Elumelu"].map(q => (
              <Link
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="px-3 py-1 rounded-full border text-[11px] transition-all hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                  backgroundColor: "var(--surface)",
                }}
              >
                {q}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
            {[
              { value: `${total}+`, label: "Verified Programs" },
              { value: "7", label: "Global Regions" },
              { value: "90+", label: "Countries" },
              { value: "Free", label: "Forever" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--foreground)" }}>
                  {value}
                </div>
                <div
                  className="text-[11px] uppercase tracking-wider mt-1"
                  style={{ color: "var(--muted)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Browse by Region
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            From Silicon Valley to Lagos, Nairobi to Singapore — the global startup ecosystem covered.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {ALL_REGIONS.map(region => (
            <Link key={region} href={`/search?region=${encodeURIComponent(region)}`}>
              <div
                className="rounded-2xl border p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-lg group cursor-pointer h-full"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{REGION_EMOJIS[region] ?? "🌍"}</span>
                  <ChevronRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                    style={{ color: "var(--muted)" }}
                  />
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>
                  {region}
                </div>
                <div className="text-xs mb-2" style={{ color: "var(--accent-2)" }}>
                  {regionCounts[region] ?? 0} programs
                </div>
                <div className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {REGION_DESC[region] ?? ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
              How it works
            </h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              From discovery to submitted application — in under an hour.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Globe,
                title: "Search & Filter",
                desc: "Filter by region, stage, focus area, and funding amount. Every program ranked by our 10-point diligence score.",
              },
              {
                step: "02",
                icon: Shield,
                title: "Read the Diligence Report",
                desc: "Every accelerator has a diligence score with notes, red flags, notable alumni, and live verification status.",
              },
              {
                step: "03",
                icon: FileText,
                title: "Get Your Template",
                desc: "Enter your startup once. Get a tailored, AI-generated application template for any program instantly.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <Icon size={20} style={{ color: "var(--accent-2)" }} />
                </div>
                <div
                  className="text-[11px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "var(--accent)" }}
                >
                  {step}
                </div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "var(--foreground)" }}>
                  {title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--foreground)" }}>
              Top Rated Programs
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Highest diligence scores in the database
            </p>
          </div>
          <Link href="/search">
            <Button variant="secondary" size="sm">
              View all <ArrowRight size={12} className="ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {featured.map((a, i) => (
            <AcceleratorCard key={a.id} accelerator={a} index={i} />
          ))}
        </div>
      </section>

      {/* Diligence highlight */}
      <section className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: "var(--surface)" }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl border p-8 sm:p-12"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-2)" }}
          >
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold mb-5"
                  style={{
                    borderColor: "rgba(52,211,153,0.3)",
                    backgroundColor: "rgba(52,211,153,0.08)",
                    color: "var(--success)",
                  }}
                >
                  <Shield size={10} />
                  Due Diligence
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-3"
                  style={{ color: "var(--foreground)" }}
                >
                  We check every accelerator so you don&apos;t apply to ghost programs
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
                  Every program gets a diligence score from 1–10. No more wasting applications on defunct
                  programs or paying to apply to scams.
                </p>
                <div className="space-y-2">
                  {[
                    "Portfolio company verification",
                    "Last active batch confirmed",
                    "Application fee transparency",
                    "Notable alumni outcomes tracked",
                    "Red flag detection",
                  ].map(item => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      <CheckCircle size={13} style={{ color: "var(--success)", flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { score: 10, name: "Y Combinator", note: "4500+ companies · $600B combined value" },
                  { score: 9, name: "Seedcamp", note: "UiPath 100x+ return · 500+ portfolio" },
                  { score: 8, name: "Hub71", note: "Abu Dhabi gov-backed · $500K equity-free" },
                  { score: 7, name: "Oasis500", note: "Founded 2010 · 200+ portfolio companies" },
                ].map(({ score, name, note }) => {
                  const color =
                    score >= 8
                      ? "var(--success)"
                      : score >= 6
                      ? "var(--gold)"
                      : "var(--warn)";
                  return (
                    <div
                      key={name}
                      className="rounded-xl border p-3.5 flex items-center gap-3"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0"
                        style={{ borderColor: color, color, backgroundColor: `${color}15` }}
                      >
                        {score}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                          {name}
                        </div>
                        <div className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                          {note}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2
          className="text-3xl sm:text-4xl font-extrabold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Your accelerator is in here.
        </h2>
        <p className="text-lg mb-8" style={{ color: "var(--muted)" }}>
          {total}+ verified programs across every industry, stage, and region. Find the ones built for you.
        </p>
        <Link href="/search">
          <Button size="lg">
            Search All Programs <ArrowRight size={14} className="ml-2" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 sm:px-6" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe size={14} style={{ color: "var(--accent-2)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
              Global Accelerators For Startup Business
            </span>
          </div>
          <p className="text-[11px]" style={{ color: "var(--muted)" }}>
            {total}+ verified programs · Updated regularly · Built for founders worldwide
          </p>
        </div>
      </footer>
    </main>
  );
}
