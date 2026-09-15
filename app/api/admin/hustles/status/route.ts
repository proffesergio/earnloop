import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const statusSchema = { draft: true, review: true, published: true } as const;
type Status = keyof typeof statusSchema;

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const body = await request.json().catch(() => null) as { id?: string; status?: string };
  if (!body?.id || !body.status || !(body.status in statusSchema)) {
    return NextResponse.json({ error: "A valid id and status are required." }, { status: 400 });
  }

  const status = body.status as Status;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("hustles")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .eq("content_type", "hustle")
    .select("id, title")
    .single();

  if (error || !data) return NextResponse.json({ error: "Could not update status." }, { status: 502 });
  await supabase.from("admin_audit").insert({ actor: session.user.id, action: status === "published" ? "publish" : "status", entity: "hustle", entity_id: data.id });
  return NextResponse.json({ id: data.id, status });
}