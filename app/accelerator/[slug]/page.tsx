import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  Globe,
  DollarSign,
  Clock,
  Users,
  Calendar,
  MapPin,
  FileText,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SaveButton } from "@/components/accelerators/SaveButton";
import type { Accelerator } from "@/lib/types";
import { REGION_COLORS } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from("accelerators").select("name,tagline").eq("slug", slug).single();
  return {
    title: data ? `${data.name} — Global Accelerators` : "Accelerator Not Found",
    description: data?.tagline ?? "",
  };
}

export default async function AcceleratorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("accelerators")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) notFound();

  const a = data as Accelerator;
  const score = a.diligence_score ?? 5;
  const scoreColor =
    score >= 8
      ? "var(--success)"
      : score >= 6
      ? "var(--gold)"
      : score >= 4
      ? "var(--warn)"
      : "var(--danger)";
  const regionColor = a.region ? (REGION_COLORS[a.region] ?? "var(--muted)") : "var(--muted)";

  const scoreLabel =
    score >= 8
      ? "Highly Trusted"
      : score >= 6
      ? "Trusted"
      : score >= 4
      ? "Proceed with Caution"
      : "Low Confidence";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={13} />
        Back to search
      </Link>

      {/* Header card */}
      <div
        className="rounded-2xl border p-6 sm:p-8 mb-6"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {a.region && (
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: regionColor }}
                >
                  {a.region}
                </span>
              )}
              {a.country && a.region !== "Global" && (
                <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                  · {a.country}
                </span>
              )}
              {a.city && (
                <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                  · {a.city}
                </span>
              )}
            </div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {a.name}
            </h1>
            {a.tagline && (
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {a.tagline}
              </p>
            )}
          </div>

          <div
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-[3px] shrink-0"
            style={{ borderColor: scoreColor, backgroundColor: `${scoreColor}12` }}
          >
            <span className="text-xl font-extrabold leading-none" style={{ color: scoreColor }}>
              {score}
            </span>
            <span className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: scoreColor }}>
              /10
            </span>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {a.is_verified && <Badge variant="success">Verified</Badge>}
          {!a.is_active && <Badge variant="warn">Inactive</Badge>}
          {a.remote_friendly && <Badge variant="accent">Remote OK</Badge>}
          {a.charges_fee && <Badge variant="danger">Charges Application Fee</Badge>}
        </div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-2)" }}
        >
          {a.funding_amount_usd !== null && a.funding_amount_usd > 0 && (
            <StatCell
              icon={<DollarSign size={11} style={{ color: "var(--success)" }} />}
              label="Funding"
              value={
                "$" +
                (a.funding_amount_usd >= 1_000_000
                  ? `${(a.funding_amount_usd / 1_000_000).toFixed(1)}M`
                  : `${(a.funding_amount_usd / 1000).toFixed(0)}K`)
              }
              valueColor="var(--success)"
            />
          )}
          {a.equity_percentage !== null && (
            <StatCell label="Equity" value={`${a.equity_percentage}%`} />
          )}
          {a.program_duration_weeks !== null && (
            <StatCell
              icon={<Clock size={11} style={{ color: "var(--muted)" }} />}
              label="Duration"
              value={`${a.program_duration_weeks} weeks`}
            />
          )}
          {a.batch_frequency && (
            <StatCell
              icon={<Calendar size={11} style={{ color: "var(--muted)" }} />}
              label="Batches"
              value={a.batch_frequency}
            />
          )}
          {a.portfolio_count !== null && (
            <StatCell
              icon={<Users size={11} style={{ color: "var(--muted)" }} />}
              label="Portfolio"
              value={`${a.portfolio_count.toLocaleString()}+`}
            />
          )}
          {a.last_batch_year && (
            <StatCell label="Last Active" value={String(a.last_batch_year)} />
          )}
          {a.acceptance_rate_pct !== null && (
            <StatCell label="Acceptance Rate" value={`${a.acceptance_rate_pct}%`} />
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mt-5">
          <SaveButton id={a.id} name={a.name} slug={a.slug} region={a.region} />
          {a.apply_url && (
            <a href={a.apply_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm">
                Apply Now <ExternalLink size={12} className="ml-1.5" />
              </Button>
            </a>
          )}
          <Link href={`/template/${a.slug}`}>
            <Button variant="secondary" size="sm">
              <FileText size={13} className="mr-1.5" />
              Application Template
            </Button>
          </Link>
          <Link href={`/apply/${a.slug}`}>
            <Button variant="ghost" size="sm">
              <BookOpen size={13} className="mr-1.5" />
              Step-by-Step Guide
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {/* Main */}
        <div className="sm:col-span-2 space-y-5">
          {a.description && (
            <Section title="About">
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {a.description}
              </p>
            </Section>
          )}

          {a.focus_areas.length > 0 && (
            <Section title="Focus Areas">
              <div className="flex flex-wrap gap-2">
                {a.focus_areas.map(f => (
                  <Link key={f} href={`/search?focus=${encodeURIComponent(f)}`}>
                    <Badge variant="accent">{f}</Badge>
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {a.stages.length > 0 && (
            <Section title="Stages Funded">
              <div className="flex flex-wrap gap-2">
                {a.stages.map(s => (
                  <Link key={s} href={`/search?stage=${encodeURIComponent(s)}`}>
                    <Badge variant="default">{s}</Badge>
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {a.notable_alumni.length > 0 && (
            <Section title="Notable Alumni">
              <div className="flex flex-wrap gap-2">
                {a.notable_alumni.map(alum => (
                  <span
                    key={alum}
                    className="px-2.5 py-1 rounded-lg border text-xs"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--surface-2)",
                      color: "var(--foreground)",
                    }}
                  >
                    {alum}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Diligence */}
          <Section title="Diligence Report">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0"
                  style={{ borderColor: scoreColor, color: scoreColor, backgroundColor: `${scoreColor}15` }}
                >
                  {score}
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    {scoreLabel}
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--muted)" }}>
                    Diligence Score / 10
                  </div>
                </div>
              </div>

              {a.diligence_notes && (
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {a.diligence_notes}
                </p>
              )}

              {a.red_flags && a.red_flags.length > 0 && (
                <div className="space-y-1">
                  <div
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--danger)" }}
                  >
                    Red Flags
                  </div>
                  {a.red_flags.map(flag => (
                    <div key={flag} className="text-xs flex gap-1.5" style={{ color: "var(--danger)" }}>
                      <span>⚠</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* Links */}
          <Section title="Links">
            <div className="space-y-2">
              {a.website_url && (
                <a
                  href={a.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs transition-opacity hover:opacity-80"
                  style={{ color: "var(--accent-2)" }}
                >
                  <Globe size={12} />
                  Website
                </a>
              )}
              {a.apply_url && (
                <a
                  href={a.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs transition-opacity hover:opacity-80"
                  style={{ color: "var(--accent-2)" }}
                >
                  <ExternalLink size={12} />
                  Apply Now
                </a>
              )}
              {a.contact_email && (
                <a
                  href={`mailto:${a.contact_email}`}
                  className="flex items-center gap-2 text-xs transition-opacity hover:opacity-80"
                  style={{ color: "var(--accent-2)" }}
                >
                  Contact
                </a>
              )}
            </div>
          </Section>

          {(a.city || a.country) && (
            <Section title="Location">
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--muted)" }}
              >
                <MapPin size={12} />
                {[a.city, a.country].filter(Boolean).join(", ")}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCell({
  icon,
  label,
  value,
  valueColor,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-0.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {label}
        </span>
      </div>
      <div
        className="font-bold text-sm"
        style={{ color: valueColor ?? "var(--foreground)" }}
      >
        {value}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <h2
        className="text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ color: "var(--muted)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
