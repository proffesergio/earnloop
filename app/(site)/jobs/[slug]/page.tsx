import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, Globe2, MapPin, Wallet } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { getJobBySlug } from "@/lib/job-content";
import { slugifyJobTitle } from "@/lib/jobs";
import { pageMetadata, articleStructuredData, breadcrumbStructuredData } from "@/lib/seo";

type JobDetailProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function isInternalJobUrl(url: string) {
  try {
    return new URL(url).host.includes("earnloop.app");
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: JobDetailProps): Promise<Metadata> {
  const slug = (await params).slug;
  const { job } = await getJobBySlug(slug);
  if (!job) return { title: "Listing not found" };
  return pageMetadata({
    title: job.seo?.title || job.title,
    description: job.seo?.description || job.summary,
    path: `/jobs/${slug}`,
  });
}

export default async function JobDetailPage({ params }: JobDetailProps) {
  const slug = (await params).slug;
  const { board, job } = await getJobBySlug(slug);

  if (!job) {
    return (
      <div className="px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Listing not found</h1>
        <Link href="/jobs" className="mt-6 inline-block text-cyan-200">Back to the board</Link>
      </div>
    );
  }

  const related = board.jobs
    .filter((item) => item.id !== job.id && (item.category === job.category || item.tags.some((tag) => job.tags.includes(tag))))
    .slice(0, 4);
  const internal = isInternalJobUrl(job.applyUrl);

  return (
    <div className="cosmic-bg flex-1">
      <article className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-cyan-200">
          <ArrowLeft className="size-4" /> Board
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-cyan-300">
          <span>{job.category}</span>
          <span>{job.postedAt}</span>
        </div>

        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{job.title}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
          {job.company ? <span>{job.company}</span> : null}
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{job.location}</span>
          {job.engagement ? <span>{job.engagement}</span> : null}
        </div>

        <AdSlot variant="leaderboard" className="mt-10" />

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <Wallet className="size-4 text-cyan-300" /> Pay band
                </div>
                <p className="mt-3 text-sm leading-6 text-lime-300 font-semibold">{job.payBand}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <MapPin className="size-4 text-cyan-300" /> Location
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-200">{job.location}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <Globe2 className="size-4 text-cyan-300" /> Type
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-200">{job.engagement || "Not stated"}</p>
              </div>
            </div>

            <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-2xl font-semibold">What this listing is</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{job.summary}</p>
            </section>

            {job.requirements.length > 0 ? (
              <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <h2 className="text-2xl font-semibold">What you need to start</h2>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  {job.requirements.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-lime-300" />
                      <span className="leading-7">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {job.howItWorks.length > 0 ? (
              <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <h2 className="text-2xl font-semibold">How it works</h2>
                <ol className="mt-5 space-y-5">
                  {job.howItWorks.map((step, index) => (
                    <li key={step} className="flex gap-4 text-slate-300">
                      <span className="text-cyan-300">0{index + 1}</span>
                      <span className="leading-7">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <AdSlot variant="in-article" />

            {job.tags.length > 0 ? (
              <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <p className="text-sm font-medium text-cyan-300">Related tags</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-slate-300">{tag}</span>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6">
              <p className="text-sm font-semibold text-cyan-200">How to start</p>
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
              >
                {internal ? "See the full loop" : "Apply on the source page"} <ExternalLink className="size-4" />
              </a>
              <div className="mt-5">
                <p className="text-xs text-slate-500">Source</p>
                <a href={job.applyUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-white">
                  <Globe2 className="size-3.5" /> {job.sourceLabel} <ArrowUpRight className="size-3" />
                </a>
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-400">
                {internal
                  ? "This links to an EarnLoop blueprint — the loop is built to prove the work, not just describe it."
                  : "Always follow the external source link for the live deadline, terms and payout details."}
              </p>
            </div>

            <AdSlot variant="sidebar" />

            {related.length > 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <p className="text-sm font-semibold text-cyan-200">Related listings</p>
                <div className="mt-4 space-y-3">
                  {related.map((item) => (
                    <Link key={item.id} href={`/jobs/${slugifyJobTitle(item.title)}`} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/10 p-3 text-sm text-slate-300 hover:border-cyan-300/40 hover:text-white">
                      <span className="flex-1">{item.title}</span>
                      <span className="mt-0.5 text-xs text-slate-500 shrink-0">{item.payBand}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>

        <p className="mt-8 text-xs leading-5 text-slate-500">
          Pay bands, availability, and engagement types change without notice. EarnLoop curates honest starting points — check the source link for live details.
        </p>

        <JsonLd
          data={articleStructuredData({
            headline: job.title,
            description: job.summary,
            path: `/jobs/${slug}`,
            author: job.sourceLabel,
          })}
        />
        <JsonLd
          data={breadcrumbStructuredData([
            { name: "Jobs", path: "/jobs" },
            { name: job.title, path: `/jobs/${slug}` },
          ])}
        />
      </article>
    </div>
  );
}