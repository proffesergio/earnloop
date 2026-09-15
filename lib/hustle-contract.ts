import { z } from "zod";

const blueprintStepSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(30).max(2000),
  effortMinutes: z.number().int().min(5).max(1440),
  isFreePreview: z.boolean(),
});

const promptSchema = z.object({
  title: z.string().trim().min(3).max(120),
  prompt: z.string().trim().min(10).max(4000),
  tool: z.string().trim().min(2).max(60).optional(),
  gated: z.boolean(),
});

const monetizationSchema = z.object({
  model: z.string().trim().min(6).max(240),
  steps: z.array(z.string().trim().min(5).max(300)).min(1).max(8),
  affiliateNotes: z.string().trim().min(5).max(400).optional(),
});

const metricsSchema = z.object({
  leading: z.array(z.string().trim().min(4).max(200)).min(1).max(8),
  lagging: z.array(z.string().trim().min(4).max(200)).min(1).max(8),
});

export const sideHustleSchema = z.object({
  schemaVersion: z.literal("1.0.0").default("1.0.0"),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(8).max(90),
  summary: z.string().trim().min(40).max(220),
  category: z.enum(["content", "commerce", "freelance", "local", "apps"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  setupHoursBand: z.enum(["0-2", "2-8", "8-plus"]),
  capitalBand: z.enum(["0", "1-50", "50-200", "200-plus"]),
  aiTools: z.array(z.enum(["chatgpt", "gemini", "claude", "midjourney", "canva", "capcut", "notion", "other"])).min(1).max(6),
  tags: z.array(z.string().trim().min(2).max(40)).max(8).optional(),
  heroMetric: z.string().trim().min(8).max(140).optional(),
  overview: z.string().trim().min(80).max(3000),
  audience: z.object({
    for: z.array(z.string().trim().min(5).max(300)).min(1).max(8),
    notFor: z.array(z.string().trim().min(5).max(300)).min(1).max(8),
  }),
  blueprint: z.array(blueprintStepSchema).min(3).max(10),
  prompts: z.array(promptSchema).min(1).max(10),
  monetization: monetizationSchema,
  metrics: metricsSchema,
  xpCompletion: z.number().int().min(10).max(200),
  seo: z.object({
    title: z.string().trim().max(180).optional(),
    description: z.string().trim().max(320).optional(),
  }).optional(),
});

export type SideHustle = z.infer<typeof sideHustleSchema>;
export type SideHustleInput = Omit<SideHustle, "schemaVersion">;

export function sideHustleToPayload(input: SideHustleInput) {
  return sideHustleSchema.parse({ ...input, schemaVersion: "1.0.0" });
}