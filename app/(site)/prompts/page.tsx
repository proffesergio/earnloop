import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, itemListStructuredData } from "@/lib/seo";
import { getPromptLibrary } from "@/lib/prompt-content";
import { PromptsExplorer } from "./explorer";

export const metadata: Metadata = pageMetadata({
  title: "AI prompt library · Build something real",
  description: "A free library of practical AI prompts for making real things: validating offers, pricing, outreach, SEO content, product visuals, and your first $1 proof. Copy, adapt, ship.",
  path: "/prompts",
});
export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const library = await getPromptLibrary();
  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
            <BookOpenText className="size-4" /> Prompt library
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Better inputs. More useful outputs.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Practical AI prompts to make real things: validate an offer, price a package, write copy, build a page, and land your first $1 proof.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/earn" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-slate-200 hover:border-cyan-300/40 hover:text-white">
              Find a blueprint that uses this <ArrowRight className="size-4" />
            </Link>
            <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-slate-200 hover:border-cyan-300/40 hover:text-white">
              Open the tool kit <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <AdSlot variant="leaderboard" className="mt-10" />

        <PromptsExplorer prompts={library} />

        <div className="mt-12 rounded-3xl border border-lime-300/20 bg-lime-300/5 p-7 sm:p-9">
          <p className="text-sm font-semibold text-lime-200">Turn a prompt into a loop</p>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            A prompt is a starting point; the proof is the deliverable. Pick a blueprint, run the matching prompt, and ship the sample before you scale.
          </p>
          <Link href="/earn" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
            Browse side-hustle blueprints <ArrowRight className="size-4" />
          </Link>
        </div>

        <JsonLd data={itemListStructuredData(library.map((prompt) => ({ name: prompt.title })))} />
      </div>
    </div>
  );
}