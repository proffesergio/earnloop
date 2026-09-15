import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { editorialMutationSchema, editorialToPayload } from "@/lib/content-contract";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("hustles").select("id, slug, content_type, status, title, summary, featured, published_at, created_at, updated_at").in("content_type", ["guide", "news"]).order("updated_at", { ascending: false });
  if (status && ["draft", "review", "published"].includes(status)) query = query.eq("status", status);
  if (type === "guide" || type === "news") query = query.eq("content_type", type);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Could not load editorial content." }, { status: 502 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = editorialMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid editorial content.", issues: parsed.error.flatten() }, { status: 400 });
  const { content, status, featured } = parsed.data;
  const payload = editorialToPayload(content);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("hustles").insert({
    slug: content.slug,
    content_type: content.contentType,
    status,
    title: content.title,
    summary: content.dek,
    payload,
    featured,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: session.user.id,
  }).select("id").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is already in use." : "Could not create the draft." }, { status: 502 });
  await supabase.from("admin_audit").insert({ actor: session.user.id, action: "create", entity: "content", entity_id: data.id });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
