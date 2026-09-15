import type { MetadataRoute } from "next";
import { hustleSeed } from "@/lib/hustles";
import { getPublishedNews } from "@/lib/content";
import { opportunities, countryGuides, slugifyMobilityName } from "@/lib/scholarships";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnloop.app";

function route(path: string, priority = 0.7) {
  return { url: `${baseUrl}${path}`, changeFrequency: "weekly" as const, priority };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    route("/", 1.0),
    route("/earn", 0.9),
    route("/learn", 0.8),
    route("/tools", 0.8),
    route("/services", 0.6),
    route("/news", 0.7),
    route("/pricing", 0.6),
    route("/prompts", 0.6),
    route("/scholarships", 0.7),
    route("/app", 0.5),
  ];

  const hustleRoutes = hustleSeed.map((item) => route(`/earn/${item.slug}`, 0.9));
  const mobilityRoutes = [
    ...opportunities.map((item) => route(`/scholarships/${slugifyMobilityName(item.name)}`, 0.6)),
    ...countryGuides.map((item) => route(`/scholarships/study-${slugifyMobilityName(item.country)}`, 0.6)),
  ];

  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const news = await getPublishedNews();
    newsRoutes = news.map((post) => route(`/news/${post.slug}`, 0.7));
  } catch {
    // Sitemap should still build if Supabase is unavailable.
  }

  return [...staticRoutes, ...hustleRoutes, ...mobilityRoutes, ...newsRoutes];
}