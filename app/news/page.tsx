import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Newspaper } from "lucide-react";
import { editorialPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "News and practical earning strategies",
  description: "Real experiments, AI workflows, and practical side-hustle income strategies from EarnLoop.",
};

export default function NewsPage() {
  const [featured, ...posts] = editorialPosts;

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">Earn<span className="text-cyan-400">Loop</span></Link>
          <nav className="flex items-center gap-5 text-sm text-slate-400">
            <Link href="/learn" className="hover:text-white">Learn</Link>
            <Link href="/earn" className="text-cyan-200 hover:text-white">Earn</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300"><Newspaper className="size-4" /> The EarnLoop journal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Useful ideas for people who ship.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">Honest experiments, practical income strategies, and AI workflows you can test without pretending the work is effortless.</p>
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-7 sm:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">Featured field note</p>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{featured.title}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">{featured.dek}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-slate-400"><span>{featured.category}</span><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{featured.readTime}</span><span>{featured.publishedAt}</span></div>
            <Link href={`/news/${featured.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Read the field note <ArrowRight className="size-4" /></Link>
          </article>
          <aside className="rounded-3xl border border-white/10 bg-[#0e1318] p-7">
            <p className="text-sm font-medium text-lime-200">This week’s loop</p>
            <h2 className="mt-3 text-2xl font-semibold">Turn one useful skill into one testable offer.</h2>
            <ol className="mt-6 space-y-5 text-sm text-slate-300">
              <li><strong className="mr-3 text-cyan-300">01</strong>Choose a narrow buyer with a visible problem.</li>
              <li><strong className="mr-3 text-cyan-300">02</strong>Ship a small sample in seven days.</li>
              <li><strong className="mr-3 text-cyan-300">03</strong>Ask what changed before you expand the offer.</li>
            </ol>
            <Link href="/earn?category=freelance" className="mt-7 inline-flex text-sm font-semibold text-cyan-200 hover:text-white">Find a matching blueprint <ArrowRight className="ml-2 size-4" /></Link>
          </aside>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center justify-between gap-4"><span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-200">{post.category}</span><span className="text-xs text-slate-500">{post.readTime}</span></div>
              <h2 className="mt-5 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 leading-7 text-slate-400">{post.dek}</p>
              <Link href={`/news/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">Read post <ArrowRight className="size-4" /></Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
