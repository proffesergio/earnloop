import "server-only";

import { countryGuides, opportunities, slugifyMobilityName, type CountryGuide, type Opportunity } from "@/lib/scholarships";
import { countryGuideSchema, mobilityDeskSchema, opportunitySchema, type MobilityDesk } from "@/lib/scholarship-contract";
import { getSiteSetting } from "@/lib/site-settings";

const DESK_KEY = "mobility_desk";

export type MobilityDeskView = { opportunities: Opportunity[]; guides: CountryGuide[] };

function normalizedSeed(): MobilityDeskView {
  return {
    opportunities: opportunities.map((item) => opportunitySchema.parse(item)),
    guides: countryGuides.map((item) => countryGuideSchema.parse(item)),
  };
}

export async function getMobilityDesk(): Promise<MobilityDeskView> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return normalizedSeed();
  }

  const saved = await getSiteSetting<unknown>(DESK_KEY);
  if (saved) {
    const parsed = mobilityDeskSchema.safeParse(saved);
    if (parsed.success) return parsed.data;
  }
  return normalizedSeed();
}

export async function getMobilityBySlug(slug: string): Promise<{ desk: MobilityDeskView; opportunity?: Opportunity; guide?: CountryGuide }> {
  const desk = await getMobilityDesk();
  const opportunity = desk.opportunities.find((item) => slugifyMobilityName(item.name) === slug);
  const guide = desk.guides.find((item) => `study-${slugifyMobilityName(item.country)}` === slug);
  return { desk, opportunity, guide };
}

export function isStoredMobilityDesk(value: unknown): value is MobilityDesk {
  return mobilityDeskSchema.safeParse(value).success;
}