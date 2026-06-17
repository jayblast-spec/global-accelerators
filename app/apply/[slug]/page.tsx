"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Accelerator } from "@/lib/types";

function Prose({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-1" style={{ color: "var(--muted)" }}>
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## "))
          return (
            <h2
              key={i}
              className="text-lg font-bold mt-8 mb-3 first:mt-0"
              style={{ color: "var(--foreground)" }}
            >
              {line.slice(3)}
            </h2>
          );
        if (line.startsWith("### "))
          return (
            <h3
              key={i}
              className="text-base font-semibold mt-5 mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {line.slice(4)}
            </h3>
          );
        if (line.startsWith("#### "))
          return (
            <h4 key={i} className="text-sm font-semibold mt-3 mb-1" style={{ color: "var(--foreground)" }}>
              {line.slice(5)}
            </h4>
          );
        if (line === "---")
          return (
            <hr key={i} className="my-5" style={{ borderColor: "var(--border)" }} />
          );
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span style={{ color: "var(--accent-2)" }}>·</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        if (/^\d+\.\s/.test(line)) {
          const dot = line.indexOf(". ");
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span
                className="shrink-0 font-semibold"
                style={{ color: "var(--accent-2)", minWidth: "18px" }}
              >
                {line.slice(0, dot + 1)}
              </span>
              <span>{line.slice(dot + 2)}</span>
            </div>
          );
        }
        if (!line.trim()) return <div key={i} className="h-2" />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export default function ApplyGuidePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [accelerator, setAccelerator] = useState<Accelerator | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [guide, setGuide] = useState<string | null>(null);
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

  async function generateGuide() {
    if (!accelerator) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accelerator }),
      });
      const data = await res.json();
      setGuide(data.guide ?? "");
      setIsDemo(data.demo ?? true);
    } catch {
      setGuide("Failed to generate guide. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function copyGuide() {
    if (!guide) return;
    await navigator.clipboard.writeText(guide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 rounded w-24" style={{ backgroundColor: "var(--surface-2)" }} />
          <div className="h-8 rounded w-64" style={{ backgroundColor: "var(--surface-2)" }} />
          <div className="h-4 rounded w-full" style={{ backgroundColor: "var(--surface-2)" }} />
        </div>
      </div>
    );
  }

  if (!accelerator) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>Accelerator not found.</p>
        <Link href="/search">
          <Button variant="secondary" size="sm" className="mt-4">
            Back to Search
          </Button>
        </Link>
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
          <BookOpen size={18} style={{ color: "var(--accent-2)" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Step-by-Step Guide
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            How to get accepted to {accelerator.name}
          </p>
        </div>
      </div>

      {!guide ? (
        <div
          className="rounded-2xl border p-8 text-center"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <Sparkles size={32} className="mx-auto mb-4" style={{ color: "var(--accent-2)" }} />
          <h2 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Generate your application guide
          </h2>
          <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
            AI-powered, specific to {accelerator.name}&apos;s portfolio, focus areas, and what they look for in founders.
          </p>
          <Button onClick={generateGuide} disabled={generating}>
            {generating ? "Generating..." : "Generate Guide"}
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
              Demo guide — add GROQ_API_KEY for AI-personalized version
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              Guide: {accelerator.name}
            </h2>
            <button
              onClick={copyGuide}
              className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <Prose content={guide} />

          <div className="flex gap-3 mt-8 pt-5 border-t" style={{ borderColor: "var(--border)" }}>
            <Button onClick={generateGuide} variant="secondary" size="sm" disabled={generating}>
              {generating ? "Regenerating..." : "Regenerate"}
            </Button>
            <Link href={`/template/${slug}`}>
              <Button size="sm">Get Application Template</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
