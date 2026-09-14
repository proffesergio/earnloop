"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { hustleSeed } from "@/lib/hustles";

const categories = ["all", "content", "commerce", "freelance", "local", "apps"] as const;

export default function EarnPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");

  const results = useMemo(
    () =>
      hustleSeed.filter((item) => {
        const matchesCategory = category === "all" || item.category === category;
        const haystack = `${item.title} ${item.summary} ${item.tags?.join(" ") ?? ""}`.toLowerCase();
        return matchesCategory && haystack.includes(query.toLowerCase());
      }),
    [category, query]
  );

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">
            Earn<span className="text-cyan-400">Loop</span>
          </Link>
          <div className="flex gap-5 text-sm text-slate-400">
            <Link href="/learn" className="hover:text-white">Learn</Link>
            <Link href="/tools" className="hover:text-white">Tools</Link>
            <Link href="/services" className="hover:text-white">Services</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-cyan-300">The hustle board</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Pick a loop worth testing this week.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            A searchable directory of small, realistic opportunities built around proof, shipping, and clear buyer demand.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0e1318] p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 size-4 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a hustle or topic"
              className="h-11 w-full rounded-xl bg-white/5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:ring-1 focus:ring-cyan-300/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm ${category === item ? "bg-cyan-300 font-semibold text-slate-950" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                {item === "all" ? "All" : item}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">{results.length} loops · built for real work, not hype</p>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {results.map((hustle) => (
            <article key={hustle.slug} className="flex flex-col rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-200">{hustle.category}</span>
                <span className="text-xs text-slate-500">{hustle.difficulty}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold">{hustle.title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{hustle.summary}</p>
              <div className="mt-5 grid gap-3 border-y border-white/10 py-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Capital</p>
                  <p className="mt-1 text-slate-200">{hustle.capitalBand}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Setup</p>
                  <p className="mt-1 text-slate-200">{hustle.setupHoursBand}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>{hustle.aiTools.join(", ")}</span>
                <span>{hustle.xpCompletion} XP</span>
              </div>
              <Link href={`/earn/${hustle.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                View loop <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

