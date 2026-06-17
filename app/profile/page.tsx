"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { User, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAccelStore } from "@/lib/store";
import type { StartupProfile } from "@/lib/types";

const STAGES = ["Pre-idea", "Pre-seed", "Seed", "Series A", "Series B+"];
const INDUSTRIES = [
  "FinTech", "HealthTech", "AI/ML", "CleanTech", "B2B SaaS", "Consumer",
  "EdTech", "AgTech", "Hardware", "Cybersecurity", "Social Impact", "Other",
];

const BLANK: StartupProfile = {
  name: "",
  stage: "",
  industry: "",
  country: "",
  description: "",
  problemSolved: "",
  uniqueAdvantage: "",
  teamSize: "",
  monthlyRevenue: "",
  askAmount: "",
};

function ProfileForm() {
  const { startupProfile, setStartupProfile } = useAccelStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams.get("return");

  const [form, setForm] = useState<StartupProfile>(startupProfile ?? BLANK);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (startupProfile) setForm(startupProfile);
  }, [startupProfile]);

  function set(field: keyof StartupProfile, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    setStartupProfile(form);
    setSaved(true);
    if (returnUrl) {
      setTimeout(() => router.push(returnUrl), 800);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <User size={18} style={{ color: "var(--accent-2)" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>My Startup Profile</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Set this once. Used to personalize every application template.
          </p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-5">
        <Field label="Startup Name" required>
          <Input
            placeholder="e.g. Acme Inc."
            value={form.name}
            onChange={e => set("name", e.target.value)}
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Current Stage" required>
            <select
              value={form.stage}
              onChange={e => set("stage", e.target.value)}
              required
              className="w-full h-10 rounded-xl border px-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: form.stage ? "var(--foreground)" : "var(--muted)",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <option value="">Select stage</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Industry" required>
            <select
              value={form.industry}
              onChange={e => set("industry", e.target.value)}
              required
              className="w-full h-10 rounded-xl border px-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: form.industry ? "var(--foreground)" : "var(--muted)",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Country" required>
          <Input
            placeholder="e.g. Nigeria, USA, UK"
            value={form.country}
            onChange={e => set("country", e.target.value)}
            required
          />
        </Field>

        <Field label="One-liner description" required>
          <textarea
            value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="What does your startup do? (1–2 sentences)"
            required
            rows={2}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all resize-none"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
        </Field>

        <Field label="Problem you're solving">
          <textarea
            value={form.problemSolved}
            onChange={e => set("problemSolved", e.target.value)}
            placeholder="What specific pain point are you solving, for whom?"
            rows={3}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all resize-none"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
        </Field>

        <Field label="Unique advantage / moat">
          <textarea
            value={form.uniqueAdvantage}
            onChange={e => set("uniqueAdvantage", e.target.value)}
            placeholder="Why are YOU uniquely positioned to win this market?"
            rows={2}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all resize-none"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Team Size">
            <Input
              placeholder="e.g. 3"
              value={form.teamSize}
              onChange={e => set("teamSize", e.target.value)}
            />
          </Field>
          <Field label="Monthly Revenue">
            <Input
              placeholder="e.g. $5K MRR"
              value={form.monthlyRevenue}
              onChange={e => set("monthlyRevenue", e.target.value)}
            />
          </Field>
          <Field label="Funding Ask">
            <Input
              placeholder="e.g. $500K"
              value={form.askAmount}
              onChange={e => set("askAmount", e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">
            {saved ? (
              <>
                <CheckCircle size={14} className="mr-1.5" />
                Profile Saved
              </>
            ) : (
              <>
                <Save size={14} className="mr-1.5" />
                Save Profile
              </>
            )}
          </Button>
          {saved && returnUrl && (
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              Redirecting back...
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
        {label}
        {required && <span style={{ color: "var(--accent)" }} className="ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileForm />
    </Suspense>
  );
}
