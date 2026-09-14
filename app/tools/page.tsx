import Link from "next/link";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

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

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">Earn<span className="text-cyan-400">Loop</span></Link>
          <div className="hidden items-center gap-5 text-sm text-slate-300 sm:flex">
            <Link href="/learn" className="hover:text-white">Learn</Link>
            <Link href="/earn" className="hover:text-white">Earn</Link>
            <Link href="/services" className="hover:text-white">Services</Link>
          </div>
        </div>
      </header>

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
      </div>
    </main>
  );
}
