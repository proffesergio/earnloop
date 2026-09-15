import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { editorialMutationSchema, editorialToPayload } from "@/lib/content-contract";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { id } = await params;
  const { data, error } = await createSupabaseAdminClient().from("hustles").select("id, slug, content_type, status, title, summary, payload, featured, published_at, created_at, updated_at").eq("id", id).in("content_type", ["guide", "news"]).single();
  if (error || !data) return NextResponse.json({ error: "Content not found." }, { status: 404 });
  return NextResponse.json({ item: data });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const parsed = editorialMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid editorial content.", issues: parsed.error.flatten() }, { status: 400 });
  const { id } = await params;
  const { content, status, featured } = parsed.data;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("hustles").update({
    slug: content.slug,
    content_type: content.contentType,
    title: content.title,
    summary: content.dek,
    payload: editorialToPayload(content),
    status,
    featured,
    published_at: status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq("id", id).in("content_type", ["guide", "news"]).select("id").single();
  if (error || !data) return NextResponse.json({ error: error?.code === "23505" ? "That slug is already in use." : "Could not update content." }, { status: 502 });
  await supabase.from("admin_audit").insert({ actor: session.user.id, action: status === "published" ? "publish" : "update", entity: "content", entity_id: id });
  return NextResponse.json({ id });
}

export async function DELETE(_: Request, { params }: Context) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("hustles").delete().eq("id", id).in("content_type", ["guide", "news"]);
  if (error) return NextResponse.json({ error: "Could not delete content." }, { status: 502 });
  await supabase.from("admin_audit").insert({ actor: session.user.id, action: "delete", entity: "content", entity_id: id });
  return NextResponse.json({ deleted: true });
}
