import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSiteSetting, upsertSiteSetting } from "@/lib/site-settings";

const KEY = "earn_include_seed";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const setting = await getSiteSetting<{ enabled: boolean }>(KEY);
  return NextResponse.json({ enabled: setting?.enabled ?? true });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const body = await request.json().catch(() => null) as { enabled?: boolean };
  if (typeof body?.enabled !== "boolean") return NextResponse.json({ error: "enabled must be a boolean." }, { status: 400 });
  const error = await upsertSiteSetting(KEY, { enabled: body.enabled });
  if (error) return NextResponse.json({ error }, { status: 502 });
  await createSupabaseAdminClient().from("admin_audit").insert({ actor: session.user.id, action: "update", entity: "curation", entity_id: KEY });
  return NextResponse.json({ enabled: body.enabled });
}