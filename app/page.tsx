import Link from "next/link";
import { ArrowRight, BookOpen, Globe2, ShieldCheck, Sparkles } from "lucide-react";

const highlights = [
  ["09", "country routes", "with official government or university links"],
  ["18", "verified starting points", "for scholarships, study and work"],
  ["100%", "free to browse", "no agent fee or application payment to EarnLoop"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Earn<span className="text-cyan-400">Loop</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-slate-300 sm:flex">
          <Link href="#how-it-works" className="hover:text-white">How it works</Link>
          <Link href="/scholarships" className="hover:text-white">Scholarships</Link>
          <Link href="#trust" className="hover:text-white">Trust & safety</Link>
        </div>
        <Link href="/scholarships" className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
          Explore routes
        </Link>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200">
          <Sparkles className="size-3.5" /> Independent guides for global mobility
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-7xl">
            Your next study route starts with a trusted source.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Find scholarships, universities and work-permit starting points for Bangladesh, India and the subcontinent—then apply on the official website, not through a mystery agent.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/scholarships" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-200">
              Browse official routes <ArrowRight className="size-4" />
            </Link>
            <Link href="#how-it-works" className="rounded-full border border-white/15 px-5 py-3 font-medium text-slate-200 hover:bg-white/5">
              See the process
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#0e1318] p-5 shadow-2xl shadow-cyan-950/20">
          <div className="rounded-2xl border border-white/10 bg-[#111920] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div><p className="text-xs text-slate-500">Your route shortlist</p><p className="mt-1 text-xl font-semibold">Study abroad, clearly</p></div>
              <Globe2 className="size-6 text-cyan-300" />
            </div>
            <div className="space-y-3 py-5">
              {["Erasmus Mundus · Europe", "Australia Awards · Australia", "MEXT Research · Japan"].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-xl bg-white/[.04] p-4">
                  <div><p className="font-medium">{item}</p><p className="mt-1 text-xs text-slate-500">Official source · {index + 1} application guide</p></div>
                  <span className="rounded-full bg-lime-300/10 px-2 py-1 text-xs text-lime-200">Verified</span>
                </div>
              ))}
            </div>
            <Link href="/scholarships" className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 py-3 text-sm font-medium text-cyan-200 hover:bg-cyan-300/10">View all routes <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1318]/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {highlights.map(([value, label, detail]) => <div key={label}><p className="text-2xl font-semibold text-cyan-200">{value}</p><p className="mt-1 font-medium">{label}</p><p className="mt-1 text-sm text-slate-500">{detail}</p></div>)}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-medium text-cyan-300">A calmer application process</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Learn → shortlist → apply</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[["01", BookOpen, "Start with the eligibility", "Compare level, nationality, deadline and funding before spending time on an application."], ["02", Globe2, "Open the official source", "Every route links to a government, programme or university domain so you can verify it yourself."], ["03", ShieldCheck, "Apply safely", "We never ask for your passport, OTP or an agent payment. Get human guidance through our social channels."]].map(([number, Icon, title, description]) => <div key={number as string} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6"><span className="text-sm text-cyan-300">{number as string}</span><Icon className="mt-8 size-6 text-slate-300" /><h3 className="mt-4 text-lg font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{description as string}</p></div>)}
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-6xl px-6 pb-20"><div className="rounded-3xl border border-lime-300/20 bg-lime-300/5 p-7 sm:p-10"><div className="flex gap-4"><ShieldCheck className="mt-1 size-6 shrink-0 text-lime-200" /><div><h2 className="text-xl font-semibold">A directory is not a promise</h2><p className="mt-2 max-w-2xl leading-7 text-slate-300">Deadlines and visa rules change. Use EarnLoop to discover and compare, then confirm every detail on the linked official website. We do not guarantee admission, a visa, a job or funding.</p><Link href="/scholarships#help" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime-200 hover:text-lime-100">Get application help <ArrowRight className="size-4" /></Link></div></div></div></section>
      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-slate-500">EarnLoop · Learn it. Ship it. Loop the earnings. · Information last reviewed September 2026</footer>
    </main>
  );
}
