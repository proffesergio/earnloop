import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { getHustleBySlug, hustleSeed } from "@/lib/hustles";

export async function generateStaticParams() {
  return hustleSeed.map((hustle) => ({ slug: hustle.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hustle = getHustleBySlug(slug);

  if (!hustle) {
    return {
      title: "Hustle not found"
    };
  }

  return {
    title: hustle.seo?.title ?? hustle.title,
    description: hustle.seo?.description ?? hustle.summary
  };
}

export default async function HustleDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hustle = getHustleBySlug(slug);

  if (!hustle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">
            Earn<span className="text-cyan-400">Loop</span>
          </Link>
          <div className="hidden items-center gap-5 text-sm text-slate-300 sm:flex">
            <Link href="/learn" className="hover:text-white">Learn</Link>
            <Link href="/earn" className="hover:text-white">Earn</Link>
            <Link href="/tools" className="hover:text-white">Tools</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link href="/earn" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white">
          <ArrowLeft className="size-4" /> Back to hustle board
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-cyan-200">
                {hustle.category}
              </span>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-slate-300">
                {hustle.difficulty}
              </span>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-slate-300">
                {hustle.setupHoursBand} setup
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{hustle.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">{hustle.summary}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <div className="rounded-xl border border-white/10 bg-[#0e1318] px-3 py-2">
                <span className="text-slate-500">Hero metric:</span> {hustle.heroMetric}
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0e1318] px-3 py-2">
                <span className="text-slate-500">XP reward:</span> {hustle.xpCompletion}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-[#0e1318] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">At a glance</p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-slate-500">Capital</span>
                <span>{hustle.capitalBand}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-slate-500">AI tools</span>
                <span>{hustle.aiTools.join(", ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Hours</span>
                <span>{hustle.setupHoursBand}</span>
              </div>
            </div>
            <Link href="/tools" className="mt-6 inline-flex items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
              Open the tool kit
            </Link>
          </aside>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="mt-4 text-slate-300 leading-7">{hustle.overview}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-2xl font-semibold">Who it is for</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold text-lime-200">Good fit</p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {hustle.audience.for.map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 text-lime-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-amber-200">Not for</p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {hustle.audience.notFor.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Sparkles className="mt-0.5 size-4 text-amber-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-2xl font-semibold">Blueprint</h2>
              <ol className="mt-6 space-y-5">
                {hustle.blueprint.map((step) => (
                  <li key={step.order} className="rounded-xl border border-white/10 bg-black/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-cyan-300/10 text-sm font-semibold text-cyan-200">
                          {step.order}
                        </span>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                      </div>
                      <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 className="size-3.5" /> {step.effortMinutes} min
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-2xl font-semibold">AI prompts</h2>
              <div className="mt-5 space-y-4">
                {hustle.prompts.map((prompt) => (
                  <div key={prompt.title} className="rounded-xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-medium">{prompt.title}</h3>
                      {prompt.gated ? (
                        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-200">
                          gated
                        </span>
                      ) : (
                        <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-lime-200">
                          free
                        </span>
                      )}
                    </div>
                    <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-white/10 bg-[#07090c] p-3 text-sm leading-6 text-slate-300">
                      {prompt.prompt}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-xl font-semibold">Monetization</h2>
              <p className="mt-4 text-sm text-slate-300">{hustle.monetization.model}</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {hustle.monetization.steps.map((step) => (
                  <li key={step} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 text-lime-300" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              {hustle.monetization.affiliateNotes ? (
                <p className="mt-5 text-xs leading-6 text-slate-400">
                  {hustle.monetization.affiliateNotes}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-xl font-semibold">Success metrics</h2>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="mb-2 text-sm font-semibold text-cyan-200">Leading</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {hustle.metrics.leading.map((metric) => (
                      <li key={metric}>• {metric}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-lime-200">Lagging</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {hustle.metrics.lagging.map((metric) => (
                      <li key={metric}>• {metric}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
