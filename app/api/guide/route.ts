import { NextRequest, NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accelerator } = body;

  if (!accelerator) return NextResponse.json({ error: "Missing accelerator" }, { status: 400 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ guide: buildDemo(accelerator), demo: true });

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: buildPrompt(accelerator) }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    if (!res.ok) return NextResponse.json({ guide: buildDemo(accelerator), demo: true });
    const json = await res.json();
    return NextResponse.json({ guide: json.choices?.[0]?.message?.content ?? "", demo: false });
  } catch {
    return NextResponse.json({ guide: buildDemo(accelerator), demo: true });
  }
}

function buildPrompt(a: Record<string, unknown>): string {
  const ctx = [
    `Accelerator: ${a.name}`,
    a.tagline ? `About: ${a.tagline}` : "",
    a.focus_areas ? `Focus: ${(a.focus_areas as string[]).join(", ")}` : "",
    a.stages ? `Stages: ${(a.stages as string[]).join(", ")}` : "",
    a.program_duration_weeks ? `Duration: ${a.program_duration_weeks} weeks` : "",
    a.equity_percentage ? `Equity taken: ${a.equity_percentage}%` : "",
    a.funding_amount_usd ? `Investment: $${(a.funding_amount_usd as number).toLocaleString()}` : "",
    a.batch_frequency ? `Batches: ${a.batch_frequency}` : "",
    a.notable_alumni ? `Notable alumni: ${(a.notable_alumni as string[]).join(", ")}` : "",
    a.diligence_notes ? `Background: ${a.diligence_notes}` : "",
  ].filter(Boolean).join("\n");

  return `You are a world-class startup advisor helping a founder get accepted to ${a.name}.

ACCELERATOR:
${ctx}

Write a detailed, practical step-by-step application guide covering:
1. What ${a.name} Actually Looks For (specific, based on their portfolio and focus)
2. How to Prepare (timeline, research, materials — concrete days/weeks)
3. Writing a Winning Application (what to emphasize, what to avoid, what ${a.name} cares about)
4. The Interview Round (format, prep, common questions — if applicable)
5. Timeline: Application to Decision (realistic expectations)
6. Red Flags That Get Founders Rejected
7. If You Don't Get In (how to improve and reapply)

Be specific to ${a.name}. Reference their portfolio. Give actionable, concrete advice — not generic platitudes.`;
}

function buildDemo(a: Record<string, unknown>): string {
  const name = String(a.name ?? "this accelerator");
  const focus = a.focus_areas
    ? (a.focus_areas as string[]).slice(0, 3).join(", ")
    : "technology";

  return `## Step-by-Step Application Guide: ${name}

---

### 1. What ${name} Actually Looks For
${name} invests in ${focus} companies with exceptional founding teams. Based on their portfolio and public track record, they consistently prioritize:

- **Team quality above all**: Deep domain expertise, unique insight, or an unfair distribution advantage
- **Large market potential**: They want to fund companies that can become category leaders — not lifestyle businesses
- **Evidence of momentum**: Any traction (users, revenue, LOIs) signals you can execute under pressure
- **Clear, specific vision**: You should explain what you do in one sentence — and it should be obvious why it matters

---

### 2. How to Prepare (3 Weeks Before Deadline)

**Week 1 — Deep Research**
- Map ${name}'s portfolio: read every company's story, find patterns in what got them funded
- Find 3 founders from recent cohorts on LinkedIn — ask for 15-minute coffee chats
- Understand the specific program structure and what happens post-acceptance

**Week 2 — Build Your Materials**
- Perfect your one-liner (say it 20 times until it sounds natural)
- Collect all traction metrics — don't estimate, get exact numbers
- Prepare a 10-slide pitch deck (Sequoia format: problem, solution, why now, market, business model, traction, team, ask)
- Source 2–3 warm introductions if possible — cold applications succeed but referrals help

**Week 3 — Write the Application**
- Complete it in one focused session, then sleep on it
- Get feedback from founders who have been through top programs
- Cut anything that isn't specific, credible, or essential

---

### 3. Writing a Winning Application

**What to emphasize:**
- Why *you specifically* are uniquely positioned to solve this — lived experience, unfair advantage, or deep expertise
- Quantified momentum: "240 paying customers at $49/month, growing 15% MoM" beats "some early users"
- What's changed in the market that makes this the right moment (timing is everything)
- Your one-sentence value proposition — crystal clear, zero jargon

**Common mistakes that kill applications:**
- Vague descriptions ("we're building an AI platform")
- Underselling traction you actually have
- Generic "why ${name}" answers that don't reference their portfolio
- Over-explaining the technology instead of the customer problem

---

### 4. The Interview Round

If selected for interview:
- **Duration**: 20–30 minutes (moves fast — they'll cut you off)
- **Format**: 2–3 interviewers, rapid-fire questions, then open Q&A
- **Key questions**: "What do you do?", "What's your traction?", "Why are you uniquely positioned?", "What's your biggest risk?"
- **Prep method**: Do 10 timed mock interviews. Every answer under 60 seconds. Have data memorized, not estimated.

---

### 5. Timeline: Application to Decision

- **Application window**: Typically 4–8 weeks before cohort start — check the website
- **Initial screening**: 1–3 weeks post-deadline
- **Interview round**: 2–4 weeks post-deadline
- **Final decision**: 1–2 weeks post-interview
- **Cohort start**: 2–4 weeks post-acceptance

**Total timeline**: Budget 8–12 weeks from application to cohort day one.

---

### 6. Red Flags That Get Founders Rejected

- No evidence of customer conversations (zero primary research)
- Solo founder with no co-founder plan or explanation
- Addressing a market too small for their return targets
- Application that reads like it was written for a different accelerator
- Overvaluation expectations that don't match your current stage
- Founders who come across as defensive when challenged on assumptions

---

### 7. If You Don't Get In

Rejection is the norm — even companies that later raised $100M+ got rejected from top programs. Your move:

1. Email the program manager and politely ask for specific feedback
2. Identify the one weakest element (team? traction? market size?) and fix it first
3. Build for 3–6 months, generate meaningful new metrics
4. Reapply the next cycle with a data-driven update ("Since our last application, we've...")
5. Apply to 5–8 programs in parallel — never bet on just one

---

*Add GROQ_API_KEY to unlock a fully AI-generated guide personalized to your startup and ${name}'s specific program.*`;
}
