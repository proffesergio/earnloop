import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { countryGuides, getCountryGuide, getOpportunity, opportunities, slugifyMobilityName } from "@/lib/scholarships";

type MobilityDetailProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [
    ...opportunities.map((item) => ({ slug: slugifyMobilityName(item.name) })),
    ...countryGuides.map((item) => ({ slug: `study-${slugifyMobilityName(item.country)}` })),
  ];
}

export async function generateMetadata({ params }: MobilityDetailProps): Promise<Metadata> {
  const slug = (await params).slug;
  const opportunity = getOpportunity(slug);
  const guide = getCountryGuide(slug);
  return {
    title: opportunity?.name ?? `${guide?.country ?? "Mobility"} study plan`,
    description: opportunity?.summary ?? guide?.summary,
  };
}

export default async function MobilityDetailPage({ params }: MobilityDetailProps) {
  const slug = (await params).slug;
  const opportunity = getOpportunity(slug);
  const guide = getCountryGuide(slug);

  if (!opportunity && !guide) {
    return (
      <div className="px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Mobility guide not found</h1>
        <Link href="/scholarships" className="mt-6 inline-block text-cyan-200">Back to Mobility</Link>
      </div>
    );
  }

  if (guide) {
    return (
      <div className="cosmic-bg flex-1">
        <article className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <Link href="/scholarships" className="inline-flex items-center gap-2 text-sm text-cyan-200">
            <ArrowLeft className="size-4" /> Mobility desk
          </Link>
          <p className="mt-8 text-sm font-medium text-cyan-300">Study plan · {guide.country}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Plan your {guide.country} study route</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{guide.summary}</p>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_300px]">
            <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-2xl font-semibold">Study-plan checklist</h2>
              <ol className="mt-6 space-y-5">
                {guide.studySteps.map((step, index) => (
                  <li key={step} className="flex gap-4 text-slate-300">
                    <span className="text-cyan-300">0{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 border-t border-white/10 pt-6">
                <h2 className="text-xl font-semibold">Prepare these documents</h2>
                <ul className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                  {guide.documents.map((document) => (
                    <li key={document} className="flex gap-2">
                      <FileText className="size-4 shrink-0 text-lime-300" />
                      {document}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <aside className="h-fit rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6">
              <p className="text-sm font-semibold text-cyan-200">Official links</p>
              <a href={guide.portal} target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-2 text-sm text-white hover:text-cyan-200">
                Study portal <ArrowUpRight className="size-4" />
              </a>
              <a href={guide.visa} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 text-sm text-white hover:text-cyan-200">
                Visa guidance <ArrowUpRight className="size-4" />
              </a>
              <p className="mt-7 text-xs leading-5 text-slate-400">
                University names are examples, not endorsements. Verify deadlines, fees, eligibility, and visa rules on the linked official pages.
              </p>
            </aside>
          </div>
        </article>
      </div>
    );
  }

  const item = opportunity;
  if (!item) {
    return null;
  }

  return (
    <div className="cosmic-bg flex-1">
      <article className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <Link href="/scholarships" className="inline-flex items-center gap-2 text-sm text-cyan-200">
          <ArrowLeft className="size-4" /> Mobility desk
        </Link>
          <div className="mt-8 flex items-center gap-3 text-sm text-cyan-300">
            <span>{item.type}</span>
            <ShieldCheck className="size-4 text-lime-300" />
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{item.name}</h1>
          <p className="mt-4 text-lg text-slate-400">{item.country} · {item.level}</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{item.summary}</p>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-xl font-semibold">Eligibility and funding</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                <strong className="text-white">Funding / route:</strong> {item.funding}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                <strong className="text-white">Eligibility:</strong> {item.eligibility}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                <strong className="text-white">How to apply:</strong> {item.howToApply}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <h2 className="text-xl font-semibold">Application checklist</h2>
              {item.steps ? (
                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-300">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Use the programme catalogue to select a current call, then follow the named institution&apos;s checklist and deadline.
                </p>
              )}
            </section>
          </div>

          <section className="mt-5 rounded-2xl border border-white/10 bg-[#0e1318] p-6">
            <h2 className="text-xl font-semibold">Typical documents</h2>
            {item.documents ? (
              <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {item.documents.map((document) => (
                  <li key={document} className="flex gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-lime-300" />
                    {document}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                Document requirements vary by programme. Check the current official call before preparing certified copies.
              </p>
            )}
            <a href={item.source} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
              {item.sourceLabel} <ArrowUpRight className="size-4" />
            </a>
          </section>

          <p className="mt-8 text-xs leading-5 text-slate-500">
            Deadlines, eligibility, funding, and immigration rules change. EarnLoop is an information service, not an immigration adviser, recruiter, or legal representative.
          </p>
        </article>
    </div>
  );
}