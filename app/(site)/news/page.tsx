import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Newspaper } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedNews } from "@/lib/content";
import { getNewsCategories } from "@/lib/news-categories";
import { pageMetadata, itemListStructuredData, absoluteUrl } from "@/lib/seo";

type NewsPageProps = { searchParams?: Promise<{ category?: string }> };

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const active = params?.category?.trim();
  if (active) {
    return pageMetadata({
      title: `${active} news and practical earning strategies`,
      description: `Latest ${active.toLowerCase()} articles, experiments, and practical side-hustle strategies from EarnLoop.`,
      path: "/news",
    });
  }
  return pageMetadata({
    title: "News and practical earning strategies",
    description: "Real experiments, AI workflows, and practical side-hustle income strategies from EarnLoop.",
    path: "/news",
  });
}

export const dynamic = "force-dynamic";

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const activeCategory = params?.category?.trim() ?? "";
  const [posts, categories] = await Promise.all([getPublishedNews(), getNewsCategories()]);
  const visible = activeCategory ? posts.filter((post) => post.category === activeCategory) : posts;
  const [featured, ...rest] = visible;

  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
            <Newspaper className="size-4" /> The EarnLoop journal
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            {activeCategory ? `${activeCategory} news` : "Useful ideas for people who ship."}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            {activeCategory
              ? `Showing articles in ${activeCategory}. Honest experiments, practical income strategies, and AI workflows you can test without pretending the work is effortless.`
              : "Honest experiments, practical income strategies, and AI workflows you can test without pretending the work is effortless."}
          </p>
        </div>

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
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">{activeCategory ? `${activeCategory} pick` : "Featured field note"}</p>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{featured.title}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">{featured.dek}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>{featured.category}</span>
                <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{featured.readTime}</span>
                <span>{featured.publishedAt}</span>
              </div>
              <Link href={`/news/${featured.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                Read the field note <ArrowRight className="size-4" />
              </Link>
            </article>
          ) : (
            <article className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0e1318] p-7 sm:p-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">Featured field note</p>
                <p className="mt-5 max-w-2xl leading-8 text-slate-400">
                  {activeCategory
                    ? `No ${activeCategory.toLowerCase()} articles match yet — the journal updates as new posts are published.`
                    : "No field notes are published yet. The journal fills when new guides and news move from draft to published in the admin queue."}
                </p>
              </div>
            </article>
          )}
          <aside className="rounded-3xl border border-white/10 bg-[#0e1318] p-7">
            <p className="text-sm font-medium text-lime-200">This week&apos;s loop</p>
            <h2 className="mt-3 text-2xl font-semibold">Turn one useful skill into one testable offer.</h2>
            <ol className="mt-6 space-y-5 text-sm text-slate-300">
              <li><strong className="mr-3 text-cyan-300">01</strong>Choose a narrow buyer with a visible problem.</li>
              <li><strong className="mr-3 text-cyan-300">02</strong>Ship a small sample in seven days.</li>
              <li><strong className="mr-3 text-cyan-300">03</strong>Ask what changed before you expand the offer.</li>
            </ol>
            <Link href="/earn?category=freelance" className="mt-7 inline-flex text-sm font-semibold text-cyan-200 hover:text-white">
              Find a matching blueprint <ArrowRight className="ml-2 size-4" />
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
                Read post <ArrowRight className="size-4" />
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