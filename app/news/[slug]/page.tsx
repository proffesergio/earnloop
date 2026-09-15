import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import { getEditorialPost } from "@/lib/content";

type NewsPostPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  const post = getEditorialPost((await params).slug);
  return post ? { title: post.title, description: post.dek } : { title: "Post not found" };
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const post = getEditorialPost((await params).slug);
  if (!post) return <main className="min-h-screen bg-[#07090c] px-6 py-24 text-center text-white"><h1 className="text-3xl font-semibold">Post not found</h1><Link href="/news" className="mt-6 inline-block text-cyan-200">Back to the journal</Link></main>;

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10"><div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5"><Link href="/news" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-white"><ArrowLeft className="size-4" /> Journal</Link><Link href="/" className="text-xl font-semibold">Earn<span className="text-cyan-400">Loop</span></Link></div></header>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <div className="flex flex-wrap items-center gap-4 text-sm text-cyan-300"><span>{post.category}</span><span className="inline-flex items-center gap-1 text-slate-500"><Clock3 className="size-4" />{post.readTime}</span><span className="text-slate-500">{post.publishedAt}</span></div>
        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{post.title}</h1>
        <p className="mt-6 text-xl leading-8 text-slate-300">{post.dek}</p>
        <p className="mt-5 text-sm text-slate-500">By {post.author}</p>
        <div className="mt-10 rounded-2xl border border-lime-300/20 bg-lime-300/5 p-6"><p className="text-sm font-semibold text-lime-200">The useful version</p><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{post.takeaways.map((takeaway) => <li key={takeaway}>✓ {takeaway}</li>)}</ul></div>
        <div className="mt-12 space-y-10">{post.sections.map((section) => <section key={section.heading}><h2 className="text-2xl font-semibold">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-slate-300">{paragraph}</p>)}</section>)}</div>
        <div className="mt-14 border-t border-white/10 pt-8"><Link href="/earn" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">Turn this into a loop <ArrowLeft className="size-4 rotate-180" /></Link></div>
      </article>
    </main>
  );
}
