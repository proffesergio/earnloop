import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { jobBoardSchema } from "@/lib/job-contract";
import { getJobBoard } from "@/lib/job-content";
import { upsertSiteSetting } from "@/lib/site-settings";

const JOBS_KEY = "job_board";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { categories, jobs } = await getJobBoard();
  return NextResponse.json({ categories, jobs });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = jobBoardSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid job board payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const error = await upsertSiteSetting(JOBS_KEY, parsed.data);
  if (error) return NextResponse.json({ error }, { status: 502 });

  await createSupabaseAdminClient()
    .from("admin_audit")
    .insert({ actor: session.user.id, action: "update", entity: "job_board", entity_id: JOBS_KEY });

  return NextResponse.json({ message: `Job board saved. ${parsed.data.jobs.length} listings are live on /jobs.` });
}