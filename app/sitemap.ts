import type { MetadataRoute } from "next";
import { hustleSeed } from "@/lib/hustles";
import { getPublishedNews } from "@/lib/content";
import { getPublishedHustles } from "@/lib/hustle-content";
import {
  opportunities,
  countryGuides,
  slugifyMobilityName,
} from "@/lib/scholarships";
import { getMobilityDesk } from "@/lib/scholarship-content";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnloop-kappa.vercel.app";

function route(path: string, priority = 0.7) {
  return {
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  };
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

  const seedHustleSlugs = new Set(hustleSeed.map((item) => item.slug));
  const hustleRoutes = hustleSeed.map((item) =>
    route(`/earn/${item.slug}`, 0.9),
  );
  const seedMobilitySlugs = new Set([
    ...opportunities.map((item) => slugifyMobilityName(item.name)),
    ...countryGuides.map(
      (item) => `study-${slugifyMobilityName(item.country)}`,
    ),
  ]);
  const mobilityRoutes = [
    ...opportunities.map((item) =>
      route(`/scholarships/${slugifyMobilityName(item.name)}`, 0.6),
    ),
    ...countryGuides.map((item) =>
      route(`/scholarships/study-${slugifyMobilityName(item.country)}`, 0.6),
    ),
  ];

  let publishedHustleRoutes: MetadataRoute.Sitemap = [];
  try {
    const hustles = await getPublishedHustles();
    publishedHustleRoutes = hustles
      .filter((item) => !seedHustleSlugs.has(item.slug))
      .map((item) => route(`/earn/${item.slug}`, 0.9));
  } catch {
    // Sitemap should still build if Supabase is unavailable.
  }

  let deskMobilityRoutes: MetadataRoute.Sitemap = [];
  try {
    const desk = await getMobilityDesk();
    deskMobilityRoutes = [
      ...desk.opportunities
        .filter(
          (item) => !seedMobilitySlugs.has(slugifyMobilityName(item.name)),
        )
        .map((item) =>
          route(`/scholarships/${slugifyMobilityName(item.name)}`, 0.6),
        ),
      ...desk.guides
        .filter(
          (item) =>
            !seedMobilitySlugs.has(
              `study-${slugifyMobilityName(item.country)}`,
            ),
        )
        .map((item) =>
          route(
            `/scholarships/study-${slugifyMobilityName(item.country)}`,
            0.6,
          ),
        ),
    ];
  } catch {
    // Sitemap should still build if Supabase is unavailable.
  }

  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const news = await getPublishedNews();
    newsRoutes = news.map((post) => route(`/news/${post.slug}`, 0.7));
  } catch {
    // Sitemap should still build if Supabase is unavailable.
  }

  return [
    ...staticRoutes,
    ...hustleRoutes,
    ...publishedHustleRoutes,
    ...mobilityRoutes,
    ...deskMobilityRoutes,
    ...newsRoutes,
  ];
}
