"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Copy, Check, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAccelStore } from "@/lib/store";
import type { Accelerator } from "@/lib/types";

function Prose({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-1" style={{ color: "var(--muted)" }}>
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## "))
          return (
            <h2 key={i} className="text-lg font-bold mt-8 mb-3 first:mt-0" style={{ color: "var(--foreground)" }}>
              {line.slice(3)}
            </h2>
          );
        if (line.startsWith("### "))
          return (
            <h3 key={i} className="text-base font-semibold mt-5 mb-2" style={{ color: "var(--foreground)" }}>
              {line.slice(4)}
            </h3>
          );
        if (line === "---")
          return <hr key={i} className="my-5" style={{ borderColor: "var(--border)" }} />;
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span style={{ color: "var(--accent-2)" }}>·</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        if (!line.trim()) return <div key={i} className="h-2" />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export default function TemplatePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { startupProfile } = useAccelStore();
  const [accelerator, setAccelerator] = useState<Accelerator | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [template, setTemplate] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/accelerators/${slug}`)
      .then(r => r.json())
      .then(d => {
        setAccelerator(d.data ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  async function generateTemplate() {
    if (!accelerator) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accelerator, profile: startupProfile }),
      });
      const data = await res.json();
      setTemplate(data.template ?? "");
      setIsDemo(data.demo ?? true);
    } catch {
      setTemplate("Failed to generate template. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function copyTemplate() {
    if (!template) return;
    await navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 rounded w-24" style={{ backgroundColor: "var(--surface-2)" }} />
          <div className="h-8 rounded w-64" style={{ backgroundColor: "var(--surface-2)" }} />
        </div>
      </div>
    );
  }

  if (!accelerator) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>Accelerator not found.</p>
        <Link href="/search"><Button variant="secondary" size="sm">Back to Search</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href={`/accelerator/${slug}`}
        className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={13} />
        Back to {accelerator.name}
      </Link>

      <div className="flex items-start gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <FileText size={18} style={{ color: "var(--accent-2)" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Application Template
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Tailored for {accelerator.name}
          </p>
        </div>
      </div>

      {/* Profile status */}
      {!startupProfile ? (
        <div
          className="rounded-xl border p-4 mb-5 flex items-center gap-3"
          style={{
            borderColor: "rgba(251,191,36,0.3)",
            backgroundColor: "rgba(251,191,36,0.06)",
          }}
        >
          <User size={16} style={{ color: "var(--warn)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium" style={{ color: "var(--warn)" }}>
              No startup profile set
            </p>
            <p className="text-[11px]" style={{ color: "var(--muted)" }}>
              Set up your profile to get a personalized template — or generate a blank template now.
            </p>
          </div>
          <button
            onClick={() => router.push(`/profile?return=/template/${slug}`)}
            className="text-[11px] font-semibold shrink-0 transition-opacity hover:opacity-80"
            style={{ color: "var(--warn)" }}
          >
            Set up profile →
          </button>
        </div>
      ) : (
        <div
          className="rounded-xl border p-4 mb-5 flex items-center gap-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <User size={16} style={{ color: "var(--success)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
              {startupProfile.name}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
              {startupProfile.stage} · {startupProfile.industry} · {startupProfile.country}
            </p>
          </div>
          <button
            onClick={() => router.push(`/profile?return=/template/${slug}`)}
            className="text-[11px] shrink-0 transition-opacity hover:opacity-80"
            style={{ color: "var(--muted)" }}
          >
            Edit
          </button>
        </div>
      )}

      {!template ? (
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <Sparkles size={32} className="mx-auto mb-4" style={{ color: "var(--accent-2)" }} />
          <h2 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Generate your application template
          </h2>
          <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
            {startupProfile
              ? `Personalized for ${startupProfile.name}, tailored to what ${accelerator.name} values.`
              : `A structured template for ${accelerator.name}'s application, with clear placeholders.`}
          </p>
          <Button onClick={generateTemplate} disabled={generating}>
            {generating ? "Generating..." : "Generate Template"}
          </Button>
        </div>
      ) : (
        <div
          className="rounded-2xl border p-6 sm:p-8"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          {isDemo && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium mb-5"
              style={{
                backgroundColor: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.2)",
                color: "var(--warn)",
              }}
            >
              Demo template — add GROQ_API_KEY for AI-personalized version
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              Template: {accelerator.name}
            </h2>
            <button
              onClick={copyTemplate}
              className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy all"}
            </button>
          </div>

          <Prose content={template} />

          <div className="flex gap-3 mt-8 pt-5 border-t" style={{ borderColor: "var(--border)" }}>
            <Button onClick={generateTemplate} variant="secondary" size="sm" disabled={generating}>
              {generating ? "Regenerating..." : "Regenerate"}
            </Button>
            <button
              onClick={copyTemplate}
              className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--accent-2)" }}
            >
              <Copy size={13} />
              Copy to clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
