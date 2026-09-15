import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hustleSeed, getHustleBySlug } from "@/lib/hustles";
import { sideHustleSchema, type SideHustle } from "@/lib/hustle-contract";
import { getSiteSetting } from "@/lib/site-settings";

const SEED_FLAG_KEY = "earn_include_seed";

export async function includeSeedHustles(): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return true;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return true;
  const setting = await getSiteSetting<{ enabled: boolean }>(SEED_FLAG_KEY);
  return setting?.enabled ?? true;
}

function parsePayload(payload: unknown): SideHustle | null {
  const parsed = sideHustleSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

function mergeSeed(seedEnrolled: boolean, published: SideHustle[]): SideHustle[] {
  if (!seedEnrolled) return published;
  const seen = new Set(published.map((item) => item.slug));
  return [...published, ...hustleSeed.filter((item) => !seen.has(item.slug))];
}

export async function getPublishedHustles(): Promise<SideHustle[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return hustleSeed;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("hustles")
    .select("payload, published_at")
    .eq("content_type", "hustle")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });

  const published = (data ?? []).flatMap((row) => {
    const hustle = parsePayload(row.payload);
    return hustle ? [hustle] : [];
  });

  const seedEnrolled = await includeSeedHustles();
  return mergeSeed(seedEnrolled, published);
}

export async function getPublishedHustle(slug: string): Promise<SideHustle | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return getHustleBySlug(slug);

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("hustles")
    .select("payload, published_at")
    .eq("slug", slug)
    .eq("content_type", "hustle")
    .eq("status", "published")
    .maybeSingle();

  const dbHustle = data ? parsePayload(data.payload) : null;
  if (dbHustle) return dbHustle;

  const seedEnrolled = await includeSeedHustles();
  return seedEnrolled ? getHustleBySlug(slug) : null;
}