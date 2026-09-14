import Link from "next/link";
import { ArrowRight, CheckCircle2, Gauge, Globe, Sparkles, Wand2, type LucideIcon } from "lucide-react";
import { hustleSeed } from "@/lib/hustles";
import { legacyNav, marketingNav } from "@/lib/nav";

const howItWorks = [
  ["01", "Learn", "Read the blueprint and validate the buyer problem before building."],
  ["02", "Ship", "Use the prompts, create a quick proof, and log the output."],
  ["03", "Earn", "Keep the offer small, honest, and repeatable before scaling up."]
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Earn<span className="text-cyan-400">Loop</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 sm:flex">
            {marketingNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/app" className="rounded-full border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/5">
              Loop dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200">
            <Sparkles className="size-3.5" /> Learn it. Ship it. Loop the earnings.
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-7xl">
            Build a real side hustle from a proven loop.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Browse AI-first hustle blueprints, use the tools to generate assets, and keep proof of work instead of chasing random ideas.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/earn" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-200">
              Browse hustles <ArrowRight className="size-4" />
            </Link>
            <Link href="/tools" className="rounded-full border border-white/15 px-5 py-3 font-medium text-slate-200 hover:bg-white/5">
              See the tools
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0e1318] p-5 shadow-2xl shadow-cyan-950/20">
          <div className="rounded-2xl border border-white/10 bg-[#111920] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs text-slate-500">Current loop</p>
                <p className="mt-1 text-xl font-semibold">Proof-first workflow</p>
              </div>
              <Gauge className="size-6 text-cyan-300" />
            </div>
            <div className="space-y-3 py-5">
              {hustleSeed.slice(0, 3).map((entry) => (
                <div key={entry.slug} className="rounded-xl border border-white/10 bg-white/[.04] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{entry.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{entry.heroMetric}</p>
                    </div>
                    <span className="rounded-full bg-lime-300/10 px-2 py-1 text-[10px] text-lime-200">{entry.xpCompletion} XP</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/app" className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 py-3 text-sm font-medium text-cyan-200 hover:bg-cyan-300/10">
              Open the dashboard <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1318]/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {[
            ["3", "starter blueprints", "small, testable offers that fit a real schedule"],
            ["80", "XP targets", "reward real proof of work, not idle clicks"],
            ["0", "overnight promises", "clear effort and honest revenue language"],
          ].map(([value, label, detail]) => (
            <div key={label}>
              <p className="text-2xl font-semibold text-cyan-200">{value}</p>
              <p className="mt-1 font-medium">{label}</p>
              <p className="mt-1 text-sm text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-medium text-cyan-300">How a loop works</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">The method is simple: learn, ship, prove.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {howItWorks.map(([number, title, description]) => (
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
            <p className="text-sm font-medium text-cyan-300">Latest hustle ideas</p>
            <h2 className="mt-2 text-3xl font-semibold">Fresh loops worth testing</h2>
          </div>
          <Link href="/earn" className="text-sm font-medium text-cyan-200 hover:text-white">Browse all</Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {hustleSeed.map((hustle) => (
            <article key={hustle.slug} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-200">
                  {hustle.category}
                </span>
                <span className="text-xs text-slate-500">{hustle.difficulty}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{hustle.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{hustle.summary}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500">
                <span>{hustle.setupHoursBand}</span>
                <Link href={`/earn/${hustle.slug}`} className="inline-flex items-center gap-2 text-cyan-200 hover:text-white">
                  View loop <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1318]/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 lg:grid-cols-3">
          {([
            { icon: Wand2, title: "AI tool kit", description: "Use a simple prompt pack to produce clean first drafts instead of generic ideas." },
            { icon: Globe, title: "Service offers", description: "Package the work you can complete reliably and sell one outcome at a time." },
            { icon: CheckCircle2, title: "Proof-first metrics", description: "Ship a public result, then improve based on actual evidence." }
          ] as Array<{ icon: LucideIcon; title: string; description: string }>).map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-[#07090c] p-6">
              <Icon className="size-6 text-cyan-300" />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-7 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-cyan-300">More EarnLoop desks</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Keep the original research tools alongside your hustle loops.</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Explore official scholarships, university portals, work routes, and the reusable prompt library. These directories remain free to browse and are kept separate from the credit-gated tools.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {legacyNav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#07090c]/60 px-4 py-3 text-sm font-medium text-cyan-100 hover:bg-white/5">
                {item.label}
                <ArrowRight className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-slate-500">
        EarnLoop · Learn it. Ship it. Loop the earnings. · Built for honest, proof-first operators.
      </footer>
    </main>
  );
}
