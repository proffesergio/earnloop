import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

const posts = [
  {
    title: "First $1 proof beats a perfect launch plan",
    summary: "Practical loops for shipping tiny proof before building an offer or product empire.",
    tag: "Growth"
  },
  {
    title: "AI tools that still need human editing",
    summary: "The useful part of AI is not raw output; it is faster iteration and better decision-making.",
    tag: "AI workflow"
  },
  {
    title: "A clean service package is easier to sell than a giant portfolio",
    summary: "Package scope, evidence, and timeline before bidding on custom work.",
    tag: "Services"
  }
] as const;

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">Earn<span className="text-cyan-400">Loop</span></Link>
          <Link href="/learn" className="text-sm text-cyan-200 hover:text-white">Learn</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
            <Newspaper className="size-4" /> Newsroom
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Short reads for operators who actually ship.</h1>
        </div>

        <section className="mt-10 space-y-5">
          {posts.map((post) => (
            <article key={post.title} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-200">{post.tag}</span>
                <span className="text-xs text-slate-500">Updated this week</span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{post.summary}</p>
              <Link href="/learn" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                Read the guide <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
