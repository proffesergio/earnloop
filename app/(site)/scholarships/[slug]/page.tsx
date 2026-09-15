import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpenCheck, CheckCircle2, ClipboardCheck, Clock3, FileText, Globe2, Landmark, SearchCheck, ShieldCheck, UserRoundCheck, Wallet } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { slugifyMobilityName, type Opportunity } from "@/lib/scholarships";
import { getMobilityBySlug } from "@/lib/scholarship-content";
import { pageMetadata, articleStructuredData, breadcrumbStructuredData } from "@/lib/seo";

type MobilityDetailProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: MobilityDetailProps): Promise<Metadata> {
  const slug = (await params).slug;
  const { opportunity, guide } = await getMobilityBySlug(slug);
  if (!opportunity && !guide) return { title: "Mobility guide not found" };
  return pageMetadata({
    title: opportunity?.name ?? `${guide?.country ?? "Mobility"} study plan`,
    description: opportunity?.summary ?? guide?.summary ?? "Official study routes, scholarships, and mobility grants.",
    path: `/scholarships/${slug}`,
  });
}

function relatedOpportunities(current: Opportunity, all: Opportunity[]) {
  return all
    .filter((item) => item.name !== current.name && (item.country === current.country || item.type === current.type))
    .slice(0, 4);
}

type Faq = { q: string; a: string };

function opportunityFaqs(item: Opportunity): Faq[] {
  const faqs: Faq[] = [];
  faqs.push({ q: `What does the ${item.type.toLowerCase()} cover?`, a: item.funding });
  faqs.push({ q: "Who is eligible to apply?", a: item.eligibility });
  faqs.push({ q: "How do I actually apply?", a: item.howToApply });
  if (item.documents?.length) {
    faqs.push({ q: "What documents do I need ready?", a: `Start with these and check the current official call for country-specific versions: ${item.documents.join("; ")}.` });
  }
  faqs.push({ q: "Where do I verify the live information?", a: `EarnLoop curates the official source only. Confirm every deadline, funding detail and eligibility rule at the ${item.sourceLabel} before applying (${item.source}).` });
  return faqs;
}

export default async function MobilityDetailPage({ params }: MobilityDetailProps) {
  const slug = (await params).slug;
  const { desk, opportunity, guide } = await getMobilityBySlug(slug);

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
        <article className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <Link href="/scholarships" className="inline-flex items-center gap-2 text-sm text-cyan-200">
            <ArrowLeft className="size-4" /> Mobility desk
          </Link>
          <p className="mt-8 text-sm font-medium text-cyan-300">Study plan · {guide.country}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Plan your {guide.country} study route</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{guide.summary}</p>

          <AdSlot variant="leaderboard" className="mt-10" />

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_300px]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <div className="flex items-center gap-3">
                  <SearchCheck className="size-5 text-cyan-300" />
                  <h2 className="text-2xl font-semibold">Study-plan checklist</h2>
                </div>
                <ol className="mt-6 space-y-5">
                  {guide.studySteps.map((step, index) => (
                    <li key={step} className="flex gap-4 text-slate-300">
                      <span className="text-cyan-300">0{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <div className="flex items-center gap-3">
                  <BookOpenCheck className="size-5 text-lime-300" />
                  <h2 className="text-2xl font-semibold">Universities to explore</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{guide.universities}.</p>
                <p className="mt-3 text-xs leading-5 text-slate-500">Examples for discovery — verify entry requirements, fees, and scholarship deadlines on each institution&apos;s own official page.</p>
              </section>

              <AdSlot variant="in-article" />

              <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-cyan-300" />
                  <h2 className="text-2xl font-semibold">Prepare these documents</h2>
                </div>
                <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  {guide.documents.map((document) => (
                    <li key={document} className="flex gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-lime-300" />
                      {document}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="h-fit space-y-5 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6">
                <p className="text-sm font-semibold text-cyan-200">Official links</p>
                <a href={guide.portal} target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-2 text-sm text-white hover:text-cyan-200">
                  <Globe2 className="size-4" /> Study portal <ArrowUpRight className="size-4" />
                </a>
                <a href={guide.visa} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 text-sm text-white hover:text-cyan-200">
                  <Landmark className="size-4" /> Visa guidance <ArrowUpRight className="size-4" />
                </a>
                <p className="mt-7 text-xs leading-5 text-slate-400">
                  University names are examples, not endorsements. Verify deadlines, fees, eligibility, and visa rules on the linked official pages.
                </p>
              </div>
              <AdSlot variant="sidebar" />
            </aside>
          </div>

          <section className="mt-5 rounded-2xl border border-white/10 bg-[#0e1318] p-6">
            <p className="text-sm font-medium text-cyan-300">Related routes</p>
            <p className="mt-2 text-sm text-slate-400">Scholarships, study portals, and work routes for moving around the world.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {desk.opportunities.filter((item) => item.country === guide.country).slice(0, 4).map((item) => (
                <Link key={item.name} href={`/scholarships/${slugifyMobilityName(item.name)}`} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-300/40 hover:text-white">
                  {item.name}
                </Link>
              ))}
              {desk.opportunities.filter((item) => item.country === guide.country).length === 0 ? (
                <span className="text-xs text-slate-500">Nothing matched yet — the desk updates as official programmes open.</span>
              ) : null}
            </div>
          </section>

          <p className="mt-8 text-xs leading-5 text-slate-500">
            Deadlines, eligibility, funding, and immigration rules change. EarnLoop is an information service, not an immigration adviser, recruiter, or legal representative.
          </p>
          <JsonLd
            data={articleStructuredData({
              headline: `Plan your ${guide.country} study route`,
              description: guide.summary,
              path: `/scholarships/${slug}`,
              author: "EarnLoop team",
            })}
          />
          <JsonLd
            data={breadcrumbStructuredData([
              { name: "Mobility", path: "/scholarships" },
              { name: `${guide.country} study plan`, path: `/scholarships/${slug}` },
            ])}
          />
        </article>
      </div>
    );
  }

  const item = opportunity;
  if (!item) {
    return null;
  }

  const faqs = opportunityFaqs(item);
  const related = relatedOpportunities(item, desk.opportunities);

  return (
    <div className="cosmic-bg flex-1">
      <article className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
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

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <QuickFact icon={<Wallet className="size-4 text-cyan-300" />} label="Funding / route" value={item.funding} />
              <QuickFact icon={<UserRoundCheck className="size-4 text-cyan-300" />} label="Level" value={item.level} />
              <QuickFact icon={<Globe2 className="size-4 text-cyan-300" />} label="Country / region" value={item.country} />
            </div>

            <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="size-5 text-cyan-300" />
                <h2 className="text-2xl font-semibold">How to apply</h2>
              </div>
              {item.steps ? (
                <ol className="mt-6 space-y-5">
                  {item.steps.map((step, index) => (
                    <li key={step} className="flex gap-4 text-slate-300">
                      <span className="text-cyan-300">0{index + 1}</span>
                      <span className="leading-7">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-5 text-sm leading-7 text-slate-300">{item.howToApply}</p>
              )}
            </section>

            <AdSlot variant="in-article" />

            <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center gap-3">
                <Clock3 className="size-5 text-cyan-300" />
                <h2 className="text-2xl font-semibold">Eligibility</h2>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-300">{item.eligibility}</p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-cyan-300" />
                <h2 className="text-2xl font-semibold">Typical documents</h2>
              </div>
              {item.documents ? (
                <ul className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  {item.documents.map((document) => (
                    <li key={document} className="flex gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-lime-300" />
                      {document}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-sm text-slate-400">
                  Document requirements vary by programme. Check the current official call before preparing certified copies.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center gap-3">
                <SearchCheck className="size-5 text-lime-300" />
                <h2 className="text-2xl font-semibold">Quick answers</h2>
              </div>
              <dl className="mt-6 space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.q} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                    <dt className="font-medium text-white">{faq.q}</dt>
                    <dd className="mt-2 text-sm leading-7 text-slate-300">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6">
              <p className="text-sm font-semibold text-cyan-200">Official source</p>
              <a href={item.source} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-200">
                {item.sourceLabel} <ArrowUpRight className="size-4" />
              </a>
              <p className="mt-4 text-xs leading-5 text-slate-400">
                EarnLoop links you straight to the government or programme office. Always sign up, cash out, or send documents only through the official portal.
              </p>
            </div>
            <AdSlot variant="sidebar" />
            {related.length > 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <p className="text-sm font-semibold text-cyan-200">Related routes</p>
                <div className="mt-4 space-y-3">
                  {related.map((item) => (
                    <Link key={item.name} href={`/scholarships/${slugifyMobilityName(item.name)}`} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/10 p-3 text-sm text-slate-300 hover:border-cyan-300/40 hover:text-white">
                      <span>{item.name}</span>
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-slate-500" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>

        <p className="mt-8 text-xs leading-5 text-slate-500">
          Deadlines, eligibility, funding, and immigration rules change. EarnLoop is an information service, not an immigration adviser, recruiter, or legal representative.
        </p>

        <JsonLd
          data={articleStructuredData({
            headline: item.name,
            description: item.summary,
            path: `/scholarships/${slug}`,
            author: "EarnLoop team",
          })}
        />
        <JsonLd
          data={breadcrumbStructuredData([
            { name: "Mobility", path: "/scholarships" },
            { name: item.name, path: `/scholarships/${slug}` },
          ])}
        />
      </article>
    </div>
  );
}

function QuickFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
        {icon} {label}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}