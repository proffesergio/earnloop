import { z } from "zod";
import type { Opportunity } from "@/lib/scholarships";

export const importCandidateSchema = z.object({
  name: z.string().trim().min(2).max(140),
  source: z.string().trim().url().max(500),
  summary: z.string().trim().max(1200).default(""),
});

export const importPayloadSchema = z.object({
  candidates: z.array(importCandidateSchema).min(1).max(50),
  sourceLabel: z.string().trim().min(2).max(160),
});

export type ImportCandidate = z.infer<typeof importCandidateSchema>;

export function mapCandidateToOpportunity(candidate: ImportCandidate, sourceLabel: string): Opportunity {
  const summary = candidate.summary.trim();
  return {
    name: candidate.name.trim().slice(0, 140),
    country: "Global",
    type: "Scholarship",
    level: "Varies",
    funding: "Stated in the original listing",
    summary:
      summary.length >= 10
        ? summary
        : `Opportunity listed on ${sourceLabel}. Open the original listing to verify criteria, funding and application steps.`,
    eligibility: "Check the original listing for eligibility and application requirements.",
    howToApply: `Apply via the original listing: ${candidate.source}`,
    source: candidate.source,
    sourceLabel,
    documents: [],
    steps: [
      "Open the original listing to verify current criteria and deadline.",
      "Prepare the documents named there.",
      "Submit before the deadline stated in the listing.",
    ],
  };
}