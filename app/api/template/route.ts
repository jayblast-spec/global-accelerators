import { NextRequest, NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accelerator, profile } = body;

  if (!accelerator) return NextResponse.json({ error: "Missing accelerator" }, { status: 400 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ template: buildDemo(accelerator, profile), demo: true });

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: buildPrompt(accelerator, profile) }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    if (!res.ok) return NextResponse.json({ template: buildDemo(accelerator, profile), demo: true });
    const json = await res.json();
    return NextResponse.json({ template: json.choices?.[0]?.message?.content ?? "", demo: false });
  } catch {
    return NextResponse.json({ template: buildDemo(accelerator, profile), demo: true });
  }
}

function buildPrompt(a: Record<string, unknown>, p: Record<string, unknown> | null): string {
  const accel = [
    `Accelerator: ${a.name}`,
    a.tagline ? `About: ${a.tagline}` : "",
    a.focus_areas ? `Focus: ${(a.focus_areas as string[]).join(", ")}` : "",
    a.stages ? `Stages funded: ${(a.stages as string[]).join(", ")}` : "",
    a.notable_alumni ? `Notable alumni: ${(a.notable_alumni as string[]).join(", ")}` : "",
    a.diligence_notes ? `Background: ${a.diligence_notes}` : "",
  ].filter(Boolean).join("\n");

  const startup = p
    ? [
        `Company: ${p.name}`,
        `Stage: ${p.stage}`,
        `Industry: ${p.industry}`,
        `Country: ${p.country}`,
        `Description: ${p.description}`,
        `Problem: ${p.problemSolved}`,
        `Advantage: ${p.uniqueAdvantage}`,
        `Team size: ${p.teamSize}`,
        `Revenue: ${p.monthlyRevenue}`,
        `Ask: ${p.askAmount}`,
      ].filter(Boolean).join("\n")
    : "No startup profile — use [brackets] as placeholders throughout.";

  return `You are a world-class startup advisor helping a founder craft a compelling application to ${a.name}.

ACCELERATOR:
${accel}

STARTUP:
${startup}

Write a complete, tailored application template for ${a.name} covering:
1. Executive summary (2-3 punchy sentences)
2. Problem statement (specific, data-anchored)
3. Solution narrative
4. Why now / market timing
5. Traction & key metrics
6. Team credentials
7. Why specifically ${a.name} (reference their portfolio and values)
8. The Ask

Use markdown headers. Fill in real startup details where provided; use [brackets] for gaps. Make it specific to ${a.name}'s known preferences — not a generic template.`;
}

function buildDemo(a: Record<string, unknown>, p: Record<string, unknown> | null): string {
  const name = String(a.name ?? "this accelerator");
  const startup = String(p?.name ?? "our company");

  return `## Application Template: ${name}

---

### Executive Summary
${startup} is building [brief 1-line description]. We help [specific customer type] to [primary outcome] — and we're doing it [key differentiator that separates you from everything else in the market].

---

### The Problem
[Describe the pain point in 2-3 sentences. Be specific: who experiences this, how often, what does it cost them in time/money/frustration? Use a concrete example or a data point if you have one.]

---

### Our Solution
[Explain your product/service clearly. What does it do? How does it work? What's the user experience? Keep it simple — if a 12-year-old can't understand it, rewrite it.]

---

### Why Now?
[Explain what has changed that makes this the right moment. Technology shift? Regulatory change? Behavioral shift? New data availability? Investors fund timing as much as ideas.]

---

### Traction
- Users / Customers: [Number and type]
- Revenue: [$X MRR / ARR]
- Growth rate: [X% month-over-month]
- Key milestones: [Partnerships, pilots, LOIs, media coverage]

---

### Team
**[Your name] — CEO/Co-Founder**
[2 sentences: relevant background + why you're uniquely positioned to solve this]

**[Co-founder name] — CTO/Co-Founder**
[2 sentences: technical background + key achievements]

---

### Why ${name}?
[3-4 sentences specific to ${name}. Reference their portfolio companies, what you know about their program, what specific resources or network access you need from them, and how you'll use the program to hit your next milestone.]

---

### The Ask
We are raising $[amount] to [specific use of funds over X months]. By the end of the program we will have [specific, measurable milestone — users, revenue, next raise closed].

---
*Fill every [bracket] with real data before submitting. Add GROQ_API_KEY for a fully personalized AI-generated version.*`;
}
