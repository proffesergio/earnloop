export type HustleCategory =
  | "content"
  | "commerce"
  | "freelance"
  | "local"
  | "apps";

export type HustleDifficulty = "easy" | "medium" | "hard";

export type SetupHoursBand = "0-2" | "2-8" | "8-plus";

export type CapitalBand = "0" | "1-50" | "50-200" | "200-plus";

export type AiToolName =
  | "chatgpt"
  | "gemini"
  | "claude"
  | "midjourney"
  | "canva"
  | "capcut"
  | "notion"
  | "other";

export interface HustleAudience {
  for: string[];
  notFor: string[];
}

export interface HustleBlueprintStep {
  order: number;
  title: string;
  body: string;
  effortMinutes: number;
  isFreePreview: boolean;
}

export interface HustlePrompt {
  title: string;
  prompt: string;
  tool?: string;
  gated: boolean;
}

export interface HustleMonetization {
  model: string;
  steps: string[];
  affiliateNotes?: string;
}

export interface HustleMetrics {
  leading: string[];
  lagging: string[];
}

export interface HustleSeo {
  title?: string;
  description?: string;
}

/** Mirrors contracts/side-hustle.schema.json — keep in sync. Prefer Zod as source of truth once the app exists. */
export interface EarnLoopSideHustle {
  schemaVersion: "1.0.0";
  slug: string;
  title: string;
  summary: string;
  category: HustleCategory;
  difficulty: HustleDifficulty;
  setupHoursBand: SetupHoursBand;
  capitalBand: CapitalBand;
  aiTools: AiToolName[];
  tags?: string[];
  heroMetric?: string;
  overview: string;
  audience: HustleAudience;
  blueprint: HustleBlueprintStep[];
  prompts: HustlePrompt[];
  monetization: HustleMonetization;
  metrics: HustleMetrics;
  xpCompletion: number;
  seo?: HustleSeo;
}

export type UserRole = "user" | "admin";

export type ContentStatus = "draft" | "review" | "published";

export type NavItemId =
  | "learn"
  | "earn"
  | "tools"
  | "services"
  | "news"
  | "pricing"
  | "loop"
  | "admin";
