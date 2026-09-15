import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sideHustleInputSchema } from "@/lib/hustle-contract";

type Context = { params: Promise<{ id: string }> };

const hustleMutationSchema = sideHustleInputSchema;

export async function GET(_: Request, { params }: Context) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { id } = await params;
  const { data, error } = await createSupabaseAdminClient()
    .from("hustles")
    .select("id, slug, content_type, status, title, summary, payload, featured, published_at, created_at, updated_at")
    .eq("id", id)
    .eq("content_type", "hustle")
    .single();
  if (error || !data) return NextResponse.json({ error: "Hustle not found." }, { status: 404 });
  return NextResponse.json({ item: data });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = hustleMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid hustle blueprint.", issues: parsed.error.flatten() }, { status: 400 });

  const { id } = await params;
  const content = parsed.data;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("hustles")
    .update({
      slug: content.slug,
      title: content.title,
      summary: content.summary,
      payload: content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("content_type", "hustle")
    .select("id")
    .single();
  if (error || !data) return NextResponse.json({ error: error?.code === "23505" ? "That slug is already in use." : "Could not update the hustle." }, { status: 502 });
  await supabase.from("admin_audit").insert({ actor: session.user.id, action: "update", entity: "hustle", entity_id: id });
  return NextResponse.json({ id });
}

export async function DELETE(_: Request, { params }: Context) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("hustles").delete().eq("id", id).eq("content_type", "hustle");
  if (error) return NextResponse.json({ error: "Could not delete the hustle." }, { status: 502 });
  await supabase.from("admin_audit").insert({ actor: session.user.id, action: "delete", entity: "hustle", entity_id: id });
  return NextResponse.json({ deleted: true });
}