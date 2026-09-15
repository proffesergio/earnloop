import "server-only";

import { jobBoardSchema, type JobBoard } from "@/lib/job-contract";
import { seedJobCategories, seedJobPosts, slugifyJobTitle } from "@/lib/jobs";
import { getSiteSetting } from "@/lib/site-settings";

const JOBS_KEY = "job_board";

function normalizedSeed(): JobBoard {
  return jobBoardSchema.parse({ categories: seedJobCategories, jobs: seedJobPosts });
}

export async function getJobBoard(): Promise<JobBoard> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return normalizedSeed();
  }

  const saved = await getSiteSetting<unknown>(JOBS_KEY);
  if (saved) {
    const parsed = jobBoardSchema.safeParse(saved);
    if (parsed.success) return parsed.data;
  }
  return normalizedSeed();
}

export async function getJobBySlug(slug: string): Promise<{ board: JobBoard; job?: (typeof seedJobPosts)[number] }> {
  const board = await getJobBoard();
  const job = board.jobs.find((item) => slugifyJobTitle(item.title) === slug);
  return { board, job };
}

export function isStoredJobBoard(value: unknown): value is JobBoard {
  return jobBoardSchema.safeParse(value).success;
}