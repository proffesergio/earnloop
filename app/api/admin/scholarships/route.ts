import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getMobilityDesk } from "@/lib/scholarship-content";
import { mobilityDeskSchema } from "@/lib/scholarship-contract";
import { upsertSiteSetting } from "@/lib/site-settings";

const DESK_KEY = "mobility_desk";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const desk = await getMobilityDesk();
  return NextResponse.json(desk);
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = mobilityDeskSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mobility desk payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const error = await upsertSiteSetting(DESK_KEY, parsed.data);
  if (error) return NextResponse.json({ error }, { status: 502 });

  await createSupabaseAdminClient()
    .from("admin_audit")
    .insert({ actor: session.user.id, action: "update", entity: "mobility_desk", entity_id: DESK_KEY });

  return NextResponse.json({ message: "Mobility desk saved. Changes are live on /scholarships." });
}