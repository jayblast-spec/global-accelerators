export type Region =
  | "North America"
  | "Europe"
  | "Africa"
  | "Asia Pacific"
  | "LATAM"
  | "MENA"
  | "Global";

export type Stage = "Pre-idea" | "Pre-seed" | "Seed" | "Series A";

export type FocusArea =
  | "FinTech"
  | "CleanTech"
  | "HealthTech"
  | "B2B SaaS"
  | "Hardware"
  | "Consumer"
  | "AI/ML"
  | "Web3"
  | "EdTech"
  | "AgTech"
  | "Social Impact"
  | "Cybersecurity"
  | "PropTech"
  | "FoodTech"
  | "DeepTech"
  | "Any";

export type BatchFrequency = "Rolling" | "Quarterly" | "Biannual" | "Annual";

export type ApplicationStatus =
  | "interested"
  | "researching"
  | "applied"
  | "interviewing"
  | "accepted"
  | "rejected";

export type Accelerator = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  website_url: string | null;
  apply_url: string | null;
  contact_email: string | null;

  city: string | null;
  country: string | null;
  region: Region | null;
  is_global: boolean;

  focus_areas: FocusArea[];
  stages: Stage[];
  funding_amount_usd: number | null;
  equity_percentage: number | null;
  program_duration_weeks: number | null;
  batch_frequency: BatchFrequency | null;
  remote_friendly: boolean;

  is_active: boolean;
  is_verified: boolean;
  last_batch_year: number | null;
  next_application_opens: string | null;

  acceptance_rate_pct: number | null;
  portfolio_count: number | null;
  notable_alumni: string[];

  diligence_score: number | null;
  diligence_notes: string | null;
  red_flags: string[];
  charges_fee: boolean;

  tags: string[];
  created_at: string;
  updated_at: string;
};

export type StartupProfile = {
  name: string;
  stage: string;
  industry: string;
  country: string;
  description: string;
  problemSolved: string;
  uniqueAdvantage: string;
  teamSize: string;
  monthlyRevenue: string;
  askAmount: string;
};

export type SavedAccelerator = {
  acceleratorId: string;
  acceleratorName: string;
  acceleratorSlug: string;
  region: string;
  savedAt: string;
  notes: string;
  status: ApplicationStatus;
};

export type AccelState = {
  savedAccelerators: SavedAccelerator[];
  startupProfile: StartupProfile | null;
  lastUpdated: string;
};

export const REGIONS: Region[] = [
  "North America",
  "Europe",
  "Africa",
  "Asia Pacific",
  "LATAM",
  "MENA",
  "Global",
];

export const STAGES: Stage[] = ["Pre-idea", "Pre-seed", "Seed", "Series A"];

export const FOCUS_AREAS: FocusArea[] = [
  "AI/ML",
  "FinTech",
  "HealthTech",
  "CleanTech",
  "B2B SaaS",
  "Consumer",
  "Hardware",
  "EdTech",
  "Web3",
  "AgTech",
  "PropTech",
  "FoodTech",
  "Cybersecurity",
  "DeepTech",
  "Social Impact",
  "Any",
];

export const REGION_COLORS: Record<Region, string> = {
  "North America": "#6366f1",
  "Europe": "#818cf8",
  "Africa": "#34d399",
  "Asia Pacific": "#f59e0b",
  "LATAM": "#ec4899",
  "MENA": "#d4a853",
  "Global": "#7b82b4",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  interested: "Interested",
  researching: "Researching",
  applied: "Applied",
  interviewing: "Interviewing",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  interested: "var(--muted)",
  researching: "var(--accent-2)",
  applied: "var(--warn)",
  interviewing: "var(--gold)",
  accepted: "var(--success)",
  rejected: "var(--danger)",
};
