import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { getJobBoard } from "@/lib/job-content";
import { slugifyJobTitle } from "@/lib/jobs";
import { pageMetadata, itemListStructuredData, absoluteUrl } from "@/lib/seo";
import JobsExplorer from "./explorer";

export const metadata: Metadata = pageMetadata({
  title: "Remote jobs, gigs and earning ideas",
  description: "Discover remote roles, virtual assistance gigs, data entry and research work, creative and writing tasks, side-hustle loops and online earning ideas.",
  path: "/jobs",
});
export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const { categories, jobs } = await getJobBoard();

  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
            <Briefcase className="size-4" /> Daily verified openings
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Find a real starting point.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Honest roles, small gigs and proof-first earning ideas. Every external listing carries a Verified source badge — what we checked and when — plus a step-by-step checklist you can follow.
          </p>
        </div>

        <AdSlot variant="leaderboard" className="mt-10" />

        <JobsExplorer categories={categories} jobs={jobs} />

        <JsonLd
          data={itemListStructuredData(
            jobs.map((item) => ({
              name: item.title,
              url: absoluteUrl(`/jobs/${slugifyJobTitle(item.title)}`),
            }))
          )}
        />
      </div>
    </div>
  );
}