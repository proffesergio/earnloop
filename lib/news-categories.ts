import "server-only";

import { z } from "zod";
import { getSiteSetting } from "@/lib/site-settings";

const NEWS_CATEGORIES_KEY = "news_categories";

const seedCategories = [
  "Tech news",
  "Football",
  "Sports",
  "AI",
  "Medical & health",
  "Science",
  "Astro & space",
] as const;

const newsCategoriesSchema = z.array(z.string().trim().min(1).max(80));

export async function getNewsCategories(): Promise<string[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [...seedCategories];
  }

  const saved = await getSiteSetting<unknown>(NEWS_CATEGORIES_KEY);
  if (saved) {
    const parsed = newsCategoriesSchema.safeParse(saved);
    if (parsed.success && parsed.data.length > 0) return parsed.data;
  }
  return [...seedCategories];
}

export function isStoredNewsCategories(value: unknown): boolean {
  return newsCategoriesSchema.safeParse(value).success;
}