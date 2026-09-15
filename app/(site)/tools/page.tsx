import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, itemListStructuredData } from "@/lib/seo";

const tools = [
  {
    name: "Hustle idea expander",
    summary: "Turn a vague niche into a shortlist of demand-driven side hustles with pricing and proof steps.",
    price: "Free demo",
    cta: "Open prompt"
  },
  {
    name: "Offer headline + landing section writer",
    summary: "Generate a simple offer, CTA, and landing section for your next service package.",
    price: "3 credits",
    cta: "Run tool"
  },
  {
    name: "Prompt pack generator",
    summary: "Create copy and workflow prompts tailored to a hustle, audience, and skill level.",
    price: "5 credits",
    cta: "Generate pack"
  }
] as const;

export const metadata: Metadata = pageMetadata({
  title: "AI tools for side hustles · EarnLoop tool kit",
  description: "Practical AI tools for positioning, generating copy, and turning a rough idea into a tiny proof loop — priced in credits, ready when you are.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
            <Wand2 className="size-4" /> Tool kit
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Use AI where it saves real work.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            These are practical tools for positioning, generating copy, and turning a rough idea into a tiny proof loop.
          </p>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          {tools.map((tool) => (
            <article key={tool.name} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-200">{tool.price}</span>
                <Sparkles className="size-5 text-cyan-300" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold">{tool.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{tool.summary}</p>
              <Link href="/earn" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                {tool.cta} <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </section>

        <AdSlot variant="in-article" className="mt-10" />

        <section className="mt-10 grid gap-5 rounded-3xl border border-white/10 bg-[#0e1318] p-7 sm:p-9 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-lime-200">Start from a prompt</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Tools handle the wrapper; the prompt library gives you the raw inputs to practice the same skills free.
            </p>
            <Link href="/prompts" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
              Open the prompt library <ArrowRight className="size-4" />
            </Link>
          </div>
          <div>
            <p className="text-sm font-semibold text-lime-200">Match a tool to a blueprint</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Every blueprint lists the AI tools it really uses and the hours it takes to set up.
            </p>
            <Link href="/earn?category=apps" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
              Browse blueprints <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <JsonLd data={itemListStructuredData(tools.map((tool) => ({ name: tool.name })))} />
      </div>
    </div>
  );
}