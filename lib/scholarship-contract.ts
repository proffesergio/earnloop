import { z } from "zod";
import { sourceVerificationSchema } from "@/lib/source-verification";

export const routeTypeSchema = z.enum(["Scholarship", "Study portal", "Work route"]);

export const opportunitySchema = z.object({
  name: z.string().trim().min(2).max(140),
  country: z.string().trim().min(1).max(80),
  type: routeTypeSchema,
  level: z.string().trim().min(1).max(120),
  funding: z.string().trim().min(1).max(240),
  summary: z.string().trim().min(10).max(1000),
  eligibility: z.string().trim().min(10).max(2000),
  howToApply: z.string().trim().min(10).max(2000),
  source: z.string().trim().url().max(500),
  sourceLabel: z.string().trim().min(2).max(160),
  documents: z.array(z.string().trim().min(1).max(300)).max(24).default([]),
  steps: z.array(z.string().trim().min(1).max(600)).max(24).default([]),
  verification: sourceVerificationSchema.default(() => ({ verified: false, checkedOn: null, checks: [] })),
});

export const countryGuideSchema = z.object({
  country: z.string().trim().min(2).max(80),
  universities: z.string().trim().min(2).max(600),
  portal: z.string().trim().url().max(500),
  visa: z.string().trim().url().max(500),
  summary: z.string().trim().min(10).max(1000),
  studySteps: z.array(z.string().trim().min(1).max(600)).min(1).max(24),
  documents: z.array(z.string().trim().min(1).max(300)).min(1).max(24),
});

export const mobilityDeskSchema = z.object({
  opportunities: z.array(opportunitySchema).max(200),
  guides: z.array(countryGuideSchema).max(80),
});

export type MobilityDesk = z.infer<typeof mobilityDeskSchema>;