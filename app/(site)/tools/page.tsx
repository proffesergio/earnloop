import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { LoopBuilder } from "@/components/loop/loop-builder";
import { getJobBoard } from "@/lib/job-content";
import { getMobilityDesk } from "@/lib/scholarship-content";
import { pageMetadata, itemListStructuredData } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The Loop Builder · one proven tool",
  description: "Turn a real opening from the Jobs board or Mobility desk into an honest 7-day action plan with a first-proof goal — no income promises.",
  path: "/tools",
});
export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const [{ jobs }, mobility] = await Promise.all([getJobBoard(), getMobilityDesk()]);

  const suggestions = [
    ...jobs.slice(0, 5).map((job) => ({ label: job.title, href: `/jobs` })),
    ...mobility.opportunities.slice(0, 5).map((item) => ({ label: item.name, href: `/scholarships` })),
  ];

  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
            <Wand2 className="size-4" /> One tool · no fake promises
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Build a loop that produces proof, not promises.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Pick a real opening from the Jobs board or the Mobility desk, set the hours you can truly give, and get a 7-day action plan with a first-proof goal. The work is real; the result is verifiable.
          </p>
        </div>

        <div className="mt-10">
          <LoopBuilder suggestions={suggestions} />
        </div>

        <AdSlot variant="in-article" className="mt-12" />

        <section className="mt-12 grid gap-5 rounded-3xl border border-white/10 bg-[#0e1318] p-7 sm:p-9 lg:grid-cols-3">
          {([
            { icon: ShieldCheck, title: "Verified sources", description: "Every external opening carries a source check you can inspect — what we confirmed, and when. No lookalike links.", href: "/jobs", cta: "Open the Jobs board" },
            { icon: BookOpenCheck, title: "Step-by-step routes", description: "Interactive checklists follow each listing from application to proof — so anyone can run a route without a mentor.", href: "/scholarships", cta: "Open the Mobility desk" },
            { icon: Sparkles, title: "Blueprints and prompts", description: "The proven blueprint library and prompt pack remain here for the people who finish a loop and want to sell the outcome.", href: "/earn", cta: "Browse blueprints" },
          ] as const).map(({ icon: Icon, title, description, href, cta }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-[#07090c] p-6">
              <Icon className="size-6 text-cyan-300" />
              <h2 className="mt-5 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
              <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                {cta} <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </section>

        <p className="mt-8 text-xs leading-5 text-slate-500">
          Honest notice: no tool on EarnLoop guarantees income. The Loop Builder turns hours of effort into verifiable proof — an application, a delivered sample, or a first $1. That proof is what the next step is built on.
        </p>

        <JsonLd
          data={itemListStructuredData(
            suggestions.map((suggestion) => ({ name: suggestion.label }))
          )}
        />
      </div>
    </div>
  );
}