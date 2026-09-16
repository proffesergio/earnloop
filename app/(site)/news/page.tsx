import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, ShieldCheck } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedNews } from "@/lib/content";
import { getNewsCategories } from "@/lib/news-categories";
import { getJobBoard } from "@/lib/job-content";
import { getMobilityDesk } from "@/lib/scholarship-content";
import { slugifyJobTitle } from "@/lib/jobs";
import { slugifyMobilityName } from "@/lib/scholarships";
import { sourceVerificationLabel } from "@/lib/source-verification";
import { pageMetadata, itemListStructuredData, absoluteUrl } from "@/lib/seo";

type NewsPageProps = { searchParams?: Promise<{ category?: string }> };

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const active = params?.category?.trim();
  if (active) {
    return pageMetadata({
      title: `${active} tips for your next move`,
      description: `Latest ${active.toLowerCase()} tips, checklists and honest how-tos for students and online workers from EarnLoop.`,
      path: "/news",
    });
  }
  return pageMetadata({
    title: "Daily openings and honest tips for your next move",
    description: "Today's verified job and scholarship openings, plus youth-focused tips and step-by-step checklists from EarnLoop.",
    path: "/news",
  });
}

export const dynamic = "force-dynamic";

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const activeCategory = params?.category?.trim() ?? "";
  const [posts, categories, board, mobility] = await Promise.all([getPublishedNews(), getNewsCategories(), getJobBoard(), getMobilityDesk()]);
  const visible = activeCategory ? posts.filter((post) => post.category === activeCategory) : posts;
  const [featured, ...rest] = visible;

  const openings = [
    ...board.jobs.slice(0, 4).map((job) => ({
      kind: job.category,
      title: job.title,
      meta: job.payBand,
      href: `/jobs/${slugifyJobTitle(job.title)}`,
      verified: job.verification?.verified,
      verifiedLabel: sourceVerificationLabel(job.verification),
    })),
    ...mobility.opportunities.slice(0, 3).map((item) => ({
      kind: item.type,
      title: item.name,
      meta: `${item.country} · ${item.level}`,
      href: `/scholarships/${slugifyMobilityName(item.name)}`,
      verified: item.verification?.verified,
      verifiedLabel: sourceVerificationLabel(item.verification),
    })),
  ];

  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
            <CalendarDays className="size-4" /> Tips & openings · updated daily
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            {activeCategory ? `${activeCategory} tips` : "A new opening today, and the honesty to show how to run it."}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            {activeCategory
              ? `Tips in ${activeCategory} — checklists, timelines and honest how-tos you can follow this week.`
              : "Daily verified jobs and scholarship openings, plus youth-focused tips: checklists, visa timing, portfolio proofs and real earnings experiments."}
          </p>
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#0e1318] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-cyan-200">Today&apos;s openings</p>
              <p className="mt-1 text-xs text-slate-500">Sourced and verified against official pages. Open one, follow the checklist.</p>
            </div>
            <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
              See all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {openings.map((item) => (
              <Link key={item.href + item.title} href={item.href} className="group flex flex-col rounded-2xl border border-white/10 bg-[#07090c] p-4 transition-colors hover:border-cyan-300/30">
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-300">{item.kind}</span>
                <p className="mt-3 flex-1 text-sm font-semibold leading-snug group-hover:text-cyan-200">{item.title}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="truncate">{item.meta}</span>
                  {item.verified ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lime-300/10 px-2 py-0.5 text-lime-200">
                      <ShieldCheck className="size-3" /> {item.verifiedLabel}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/news"
            className={`rounded-full px-4 py-2 text-sm ${!activeCategory ? "bg-cyan-300 font-semibold text-slate-950" : "text-slate-400 hover:bg-white/5"}`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/news?category=${encodeURIComponent(category)}`}
              className={`rounded-full px-4 py-2 text-sm ${activeCategory === category ? "bg-cyan-300 font-semibold text-slate-950" : "text-slate-400 hover:bg-white/5"}`}
            >
              {category}
            </Link>
          ))}
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {featured ? (
            <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-7 sm:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">{activeCategory ? `${activeCategory} pick` : "Featured tip"}</p>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{featured.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">{featured.dek}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>{featured.category}</span>
                <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{featured.readTime}</span>
                <span>{featured.publishedAt}</span>
              </div>
              <Link href={`/news/${featured.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                Read the tip <ArrowRight className="size-4" />
              </Link>
            </article>
          ) : (
            <article className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0e1318] p-7 sm:p-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">Featured tip</p>
                <p className="mt-5 max-w-2xl leading-8 text-slate-400">
                  {activeCategory
                    ? `No ${activeCategory.toLowerCase()} tips match yet — the journal updates as new posts are published.`
                    : "No tips are published yet. The journal fills when new guides and news move from draft to published in the admin queue."}
                </p>
              </div>
            </article>
          )}
          <aside className="rounded-3xl border border-white/10 bg-[#0e1318] p-7">
            <p className="text-sm font-medium text-lime-200">This week&apos;s loop</p>
            <h2 className="mt-3 text-2xl font-semibold">Turn one verified opening into one proof of work.</h2>
            <ol className="mt-6 space-y-5 text-sm text-slate-300">
              <li><strong className="mr-3 text-cyan-300">01</strong>Pick one listing and read it on the official page.</li>
              <li><strong className="mr-3 text-cyan-300">02</strong>Ship exactly what it asks for within seven days.</li>
              <li><strong className="mr-3 text-cyan-300">03</strong>Capture proof — reply, file, or first $1 — then repeat.</li>
            </ol>
            <Link href="/tools" className="mt-7 inline-flex text-sm font-semibold text-cyan-200 hover:text-white">
              Run the Loop Builder <ArrowRight className="ml-2 size-4" />
            </Link>
          </aside>
        </section>

        <AdSlot variant="in-article" className="mt-12" />

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {rest.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center justify-between gap-4">
                <Link href={`/news?category=${encodeURIComponent(post.category)}`} className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-200">{post.category}</Link>
                <span className="text-xs text-slate-500">{post.readTime}</span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 leading-7 text-slate-400">{post.dek}</p>
              <Link href={`/news/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                Read tip <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </section>

        <JsonLd
          data={itemListStructuredData(
            visible.map((post) => ({ name: post.title, url: absoluteUrl(`/news/${post.slug}`) }))
          )}
        />
      </div>
    </div>
  );
}