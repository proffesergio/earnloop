import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { prompts } from "@/lib/prompts";
import { getStoredPromptAdditions } from "@/lib/prompt-content";
import { promptLibrarySchema } from "@/lib/prompt-contract";
import { upsertSiteSetting } from "@/lib/site-settings";

const LIBRARY_KEY = "prompt_library";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const additions = await getStoredPromptAdditions();
  return NextResponse.json({ seed: prompts, additions });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = promptLibrarySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prompt library payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const error = await upsertSiteSetting(LIBRARY_KEY, parsed.data);
  if (error) return NextResponse.json({ error }, { status: 502 });

  await createSupabaseAdminClient()
    .from("admin_audit")
    .insert({ actor: session.user.id, action: "update", entity: "prompt_library", entity_id: LIBRARY_KEY });

  return NextResponse.json({ message: "Prompt library saved. Changes are live on /prompts." });
}