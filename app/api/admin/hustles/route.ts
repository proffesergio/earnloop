import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  let query = createSupabaseAdminClient()
    .from("hustles")
    .select("id, slug, content_type, status, title, summary, featured, published_at, created_at, updated_at")
    .eq("content_type", "hustle")
    .order("updated_at", { ascending: false });
  if (status && ["draft", "review", "published"].includes(status)) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Could not load hustles." }, { status: 502 });
  return NextResponse.json({ items: data ?? [] });
}