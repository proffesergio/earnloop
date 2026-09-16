import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { jobBoardSchema } from "@/lib/job-contract";
import { getJobBoard } from "@/lib/job-content";
import { isInternalEarnLoopUrl, isVerifiedSource } from "@/lib/source-verification";
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

  const unverified = parsed.data.jobs.filter((job) => {
    if (isInternalEarnLoopUrl(job.applyUrl)) return false;
    return !isVerifiedSource(job.verification);
  });
  if (unverified.length > 0) {
    return NextResponse.json(
      {
        error:
          "Source verification required before publishing. Confirm every 'Source verification' checkbox on: " +
          unverified.map((job) => `“${job.title}”`).join(", ") +
          " — each external listing must be checked against its official page.",
        unverified: unverified.map((job) => ({ id: job.id, title: job.title })),
      },
      { status: 400 }
    );
  }

  const error = await upsertSiteSetting(JOBS_KEY, parsed.data);
  if (error) return NextResponse.json({ error }, { status: 502 });

  await createSupabaseAdminClient()
    .from("admin_audit")
    .insert({ actor: session.user.id, action: "update", entity: "job_board", entity_id: JOBS_KEY });

  return NextResponse.json({ message: `Job board saved. ${parsed.data.jobs.length} listings are live on /jobs.` });
}