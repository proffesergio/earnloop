import { z } from "zod";

/**
 * Every external opening (job or mobility route) must be confirmed against its
 * official source before it can be published. These are the checks the curator
 * is asked to confirm — a source verification "user question" before publish.
 */
export const SOURCE_VERIFICATION_CHECKS = [
  "I opened the source link in a new tab — it loads the live page, not a search result or scraper.",
  "The domain belongs to the official company, government, programme, or university (lookalikes are rejected).",
  "Pay, availability, requirements, and rules were copied from the live page — nothing invented.",
  "A deadline, opening window, or 'rolling' note was captured from the source page.",
] as const;

export const sourceVerificationSchema = z.object({
  verified: z.boolean().default(false),
  checkedOn: z.string().nullable().default(null),
  checks: z.array(z.string().trim().max(300)).max(24).default([]),
});

export type SourceVerification = z.infer<typeof sourceVerificationSchema>;

export function defaultSourceVerification(): SourceVerification {
  return { verified: false, checkedOn: null, checks: [] };
}

/**
 * Baseline stamp applied to the pre-curated starter feed (which was built from
 * official sources). Anything entered in the admin manager — or re-saved —
 * must go through the live confirmation flow instead.
 */
export function baselineVerifiedStamp(): SourceVerification {
  return { verified: true, checkedOn: new Date().toISOString().slice(0, 10), checks: [...SOURCE_VERIFICATION_CHECKS] };
}

export function isVerifiedSource(verification: SourceVerification | null | undefined): verification is SourceVerification {
  return Boolean(verification?.verified && verification.checkedOn);
}

export function sourceVerificationLabel(verification: SourceVerification | null | undefined): string {
  if (!isVerifiedSource(verification)) return "Check the official source first";
  const parsed = verification.checkedOn ? new Date(verification.checkedOn) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return "Verified source";
  return `Verified ${parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

/**
 * Internal URLs point at EarnLoop's own proven blueprints / loops. Those are
 * authored by the team, so they do not require an external source confirmation.
 */
export function isInternalEarnLoopUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "earnloop.app" || host.endsWith(".earnloop.app");
  } catch {
    return false;
  }
}