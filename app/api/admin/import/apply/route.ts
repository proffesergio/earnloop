import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { importPayloadSchema, mapCandidateToOpportunity } from "@/lib/importer/map";
import { getMobilityDesk } from "@/lib/scholarship-content";
import { mobilityDeskSchema } from "@/lib/scholarship-contract";
import { upsertSiteSetting } from "@/lib/site-settings";
import type { Opportunity } from "@/lib/scholarships";

const DESK_KEY = "mobility_desk";
const MAX_OPPORTUNITIES = 200;

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = importPayloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid import payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const desk = await getMobilityDesk();
  const existingSources = new Set(desk.opportunities.map((item) => item.source));

  const added: Opportunity[] = [];
  let duplicates = 0;
  for (const candidate of parsed.data.candidates) {
    if (existingSources.has(candidate.source)) {
      duplicates += 1;
      continue;
    }
    added.push(mapCandidateToOpportunity(candidate, parsed.data.sourceLabel));
    existingSources.add(candidate.source);
  }

  const capacity = Math.max(0, MAX_OPPORTUNITIES - desk.opportunities.length);
  const keep = added.slice(0, capacity);
  const overflow = added.length - keep.length;

  if (keep.length === 0) {
    return NextResponse.json({
      imported: 0,
      duplicates,
      overflow,
      message: "Nothing new to import — every selected item is already in the Mobility desk.",
    });
  }

  const nextDesk = { opportunities: [...desk.opportunities, ...keep], guides: desk.guides };
  const validated = mobilityDeskSchema.safeParse(nextDesk);
  if (!validated.success) {
    return NextResponse.json({ error: "The merged desk does not validate against the contract." }, { status: 400 });
  }

  const error = await upsertSiteSetting(DESK_KEY, validated.data);
  if (error) return NextResponse.json({ error }, { status: 502 });

  await createSupabaseAdminClient()
    .from("admin_audit")
    .insert({ actor: session.user.id, action: "import", entity: "mobility_desk", entity_id: DESK_KEY });

  const details = [
    `Imported ${keep.length} into the Mobility desk.`,
    duplicates ? ` ${duplicates} already listed.` : "",
    overflow ? ` ${overflow} dropped at the ${MAX_OPPORTUNITIES}-route cap.` : "",
  ].join("");

  return NextResponse.json({ imported: keep.length, duplicates, overflow, message: details });
}