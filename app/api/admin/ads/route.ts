import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AD_SETTINGS_KEY, adSettingsSchema, getAdsConfig, type AdSettings } from "@/lib/ads";
import { getSiteSetting, upsertSiteSetting } from "@/lib/site-settings";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const env = getAdsConfig();
  const saved = await getSiteSetting<Partial<AdSettings>>(AD_SETTINGS_KEY);
  return NextResponse.json({
    env,
    saved: saved ?? null,
  });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = adSettingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ad settings.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const error = await upsertSiteSetting(AD_SETTINGS_KEY, parsed.data);
  if (error) return NextResponse.json({ error }, { status: 502 });

  await createSupabaseAdminClient()
    .from("admin_audit")
    .insert({ actor: session.user.id, action: "update", entity: "ads_settings", entity_id: AD_SETTINGS_KEY });
  return NextResponse.json({ saved: parsed.data });
}