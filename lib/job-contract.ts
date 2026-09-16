import { z } from "zod";
import { sourceVerificationSchema } from "@/lib/source-verification";

export const jobSeoSchema = z.object({
  title: z.string().trim().max(180).optional(),
  description: z.string().trim().max(320).optional(),
});

export const jobPostingSchema = z.object({
  id: z.string().trim().min(1).max(120),
  title: z.string().trim().min(3).max(140),
  company: z.string().trim().max(120).default(""),
  category: z.string().trim().min(2).max(80),
  location: z.string().trim().max(80).default("Remote"),
  payBand: z.string().trim().min(2).max(160),
  engagement: z.string().trim().max(120).default(""),
  postedAt: z.string().trim().min(3).max(60),
  applyUrl: z.string().trim().url().max(500),
  sourceLabel: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(20).max(1000),
  requirements: z.array(z.string().trim().min(1).max(400)).max(24).default([]),
  howItWorks: z.array(z.string().trim().min(1).max(400)).max(24).default([]),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  featured: z.boolean().default(false),
  verification: sourceVerificationSchema.default(() => ({ verified: false, checkedOn: null, checks: [] })),
  seo: jobSeoSchema.default({}),
});

export const jobBoardSchema = z.object({
  categories: z.array(z.string().trim().min(2).max(80)).min(1).max(40),
  jobs: z.array(jobPostingSchema).max(300),
});

export type JobPosting = z.infer<typeof jobPostingSchema>;
export type JobBoard = z.infer<typeof jobBoardSchema>;

export const DEFAULT_JOB_CATEGORIES = [
  "Remote jobs",
  "Virtual assistance",
  "Data entry & research",
  "Graphic & creative",
  "Writing & proofreading",
  "Social media management",
  "Side hustles & tips",
  "Online earning ideas",
] as const;