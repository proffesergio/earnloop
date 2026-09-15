import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getNewsCategories } from "@/lib/news-categories";
import { upsertSiteSetting } from "@/lib/site-settings";

const NEWS_CATEGORIES_KEY = "news_categories";
const newsCategoriesSchema = z.array(z.string().trim().min(1).max(80)).max(80);

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const categories = await getNewsCategories();
  return NextResponse.json({ categories });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = newsCategoriesSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.length === 0) {
    return NextResponse.json({ error: "Provide at least one category." }, { status: 400 });
  }

  const error = await upsertSiteSetting(NEWS_CATEGORIES_KEY, parsed.data);
  if (error) return NextResponse.json({ error }, { status: 502 });

  await createSupabaseAdminClient()
    .from("admin_audit")
    .insert({ actor: session.user.id, action: "update", entity: "news_categories", entity_id: NEWS_CATEGORIES_KEY });

  return NextResponse.json({ message: `News categories saved. ${parsed.data.length} categories are live.` });
}