import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck } from "lucide-react";
import { getJobBoard } from "@/lib/job-content";
import { getMobilityDesk } from "@/lib/scholarship-content";
import { slugifyJobTitle } from "@/lib/jobs";
import { slugifyMobilityName } from "@/lib/scholarships";
import { sourceVerificationLabel } from "@/lib/source-verification";
import { AdSlot } from "@/components/ads/ad-slot";


export const dynamic = "force-dynamic";

const methodSteps = [
  ["01", "Audit", "Read the opening on its official page. Write one line for the pay, one line for what they require, and one honest line on why you fit."],
  ["02", "Verify", "Open the source in a fresh tab. Confirm it is the official domain, not a lookalike or scraper, and save the deadline or “rolling” note."],
  ["03", "Build", "Prepare exactly what the listing asks for — resume, sample, documents, form fields — in one focused sitting using your real hours."],
  ["04", "Prove & repeat", "Ship it, follow up once, capture proof (a reply, a file, or a first $1), then decide continue, change, or stop."],
] as const;

export default async function Home() {
  const [{ jobs }, mobility] = await Promise.all([getJobBoard(), getMobilityDesk()]);

  const featuredJobs = jobs.slice(0, 3);
  const featuredOpportunities = mobility.opportunities.slice(0, 2);
  const openCard = [...featuredJobs.map((job) => ({ title: job.title, meta: job.payBand, href: `/jobs/${slugifyJobTitle(job.title)}`, verified: Boolean(job.verification?.verified), verifiedLabel: sourceVerificationLabel(job.verification) })), ...featuredOpportunities.map((item) => ({ title: item.name, meta: `${item.country} · ${item.type}`, href: `/scholarships/${slugifyMobilityName(item.name)}`, verified: Boolean(item.verification?.verified), verifiedLabel: sourceVerificationLabel(item.verification) }))];

  return (
    <>
      <section className="cosmic-grid relative mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200">
            <CalendarDays className="size-3.5" /> Verified openings, posted daily
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-7xl">
            Find a real opening. Follow it through to proof.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            EarnLoop curates remote jobs, gigs, scholarships and work routes — each external listing checked against its official source, with a step-by-step checklist anyone can follow.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/jobs" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-200">
              Browse today&apos;s openings <ArrowRight className="size-4" />
            </Link>
            <Link href="/scholarships" className="rounded-full border border-white/15 px-5 py-3 font-medium text-slate-200 hover:bg-white/5">
              Open the Mobility desk
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Turning an opening into a loop? <Link href="/tools" className="font-medium text-cyan-200 hover:text-white">Run the Loop Builder</Link> — a proven 7-day plan, not a promise.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0e1318]/80 p-5 shadow-2xl shadow-cyan-950/20">
          <div className="rounded-2xl border border-white/10 bg-[#111920] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs text-slate-500">Today&apos;s openings</p>
                <p className="mt-1 text-xl font-semibold">Checked, sourced, ready to follow</p>
              </div>
              <ShieldCheck className="size-6 text-lime-300" />
            </div>
            <div className="space-y-3 py-5">
              {openCard.map((entry) => (
                <Link key={entry.href} href={entry.href} className="block rounded-xl border border-white/10 bg-white/[.04] p-4 transition-colors hover:border-cyan-300/30">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium leading-snug">{entry.title}</p>
                    <ArrowRight className="size-4 shrink-0 text-cyan-300" />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 text-[10px] text-cyan-200">{entry.meta}</span>
                    {entry.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-lime-300/10 px-2 py-0.5 text-[10px] text-lime-200">
                        <ShieldCheck className="size-3" /> {entry.verifiedLabel}
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/jobs" className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 py-3 text-sm font-medium text-cyan-200 hover:bg-cyan-300/10">
              See all openings <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1318]/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-4">
          {[
            [String(jobs.length), "job listings", "pay, scope and a real source for every one"],
            [String(mobility.opportunities.length), "mobility routes", "scholarships, study and work routes"],
            [String(mobility.guides.length), "country study plans", "official portals, visas and documents"],
            ["100%", "source-checked", "external listings require curator confirmation"],
          ].map(([value, label, detail]) => (
            <div key={label}>
              <p className="text-2xl font-semibold text-cyan-200">{value}</p>
              <p className="mt-1 font-medium">{label}</p>
              <p className="mt-1 text-sm text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot variant="multiplex" className="mx-auto max-w-6xl px-6 py-14" />

      <section id="method" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-300">The EarnLoop method</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Proven work, real effort — no fake promises.</h2>
          </div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
            Run the Loop Builder <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {methodSteps.map(([number, title, description]) => (
            <div key={number} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <span className="text-sm text-cyan-300">{number}</span>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan-300">Mobility desk · new this week</p>
            <h2 className="mt-2 text-3xl font-semibold">Scholarships and work routes worth verifying</h2>
          </div>
          <Link href="/scholarships" className="text-sm font-medium text-cyan-200 hover:text-white">Open the desk</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mobility.opportunities.slice(0, 6).map((item) => (
            <Link key={item.name} href={`/scholarships/${slugifyMobilityName(item.name)}`} className="group flex flex-col rounded-2xl border border-white/10 bg-[#0e1318] p-6 transition-colors hover:border-cyan-300/30">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-cyan-200">{item.type}</span>
                {item.verification?.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-lime-300/10 px-2.5 py-1 text-lime-200">
                    <ShieldCheck className="size-3" /> {sourceVerificationLabel(item.verification)}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 text-xl font-semibold leading-snug group-hover:text-cyan-200">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.country} · {item.level}</p>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-400">{item.funding}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                Follow the route <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1318]/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-cyan-300">Jobs board · today</p>
              <h2 className="mt-2 text-3xl font-semibold">Honest roles and gigs, one source each</h2>
            </div>
            <Link href="/jobs" className="text-sm font-medium text-cyan-200 hover:text-white">Browse all</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.slice(0, 6).map((job) => (
              <Link key={job.id} href={`/jobs/${slugifyJobTitle(job.title)}`} className="group flex flex-col rounded-2xl border border-white/10 bg-[#07090c] p-6 transition-colors hover:border-cyan-300/30">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-cyan-200">{job.category}</span>
                  {job.verification?.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-300/10 px-2.5 py-1 text-lime-200">
                      <ShieldCheck className="size-3" /> {sourceVerificationLabel(job.verification)}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-snug group-hover:text-cyan-200">{job.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{job.company || job.location}</p>
                <p className="mt-3 text-sm font-semibold text-lime-300">{job.payBand}</p>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400 line-clamp-2">{job.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 pb-28">
        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-7 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-cyan-300">Daily tips for your next move</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">The youth-focused journal: openings, checklists and honest how-tos.</h2>
            <p className="mt-4 leading-7 text-slate-300">
              New articles cover scholarships, job applications, visa timing, portfolio proofs and earnings experiments — written for people who want a route they can actually follow, not vague advice.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link href="/news" className="flex items-center justify-between rounded-xl border border-white/10 bg-[#07090c]/60 px-4 py-3 text-sm font-medium text-cyan-100 hover:bg-white/5">
              Open the Tips journal <ArrowRight className="size-4" />
            </Link>
            <Link href="/scholarships" className="flex items-center justify-between rounded-xl border border-white/10 bg-[#07090c]/60 px-4 py-3 text-sm font-medium text-cyan-100 hover:bg-white/5">
              Country study plans <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}