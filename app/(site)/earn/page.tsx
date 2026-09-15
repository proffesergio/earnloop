"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { hustleSeed } from "@/lib/hustles";
import { HustleCard } from "@/components/hustle/hustle-card";

const categories = ["all", "content", "commerce", "freelance", "local", "apps"] as const;
const difficulties = ["all", "easy", "medium", "hard"] as const;

export default function EarnPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("all");

  const results = useMemo(
    () =>
      hustleSeed.filter((item) => {
        const matchesCategory = category === "all" || item.category === category;
        const matchesDifficulty = difficulty === "all" || item.difficulty === difficulty;
        const haystack = `${item.title} ${item.summary} ${item.tags?.join(" ") ?? ""}`.toLowerCase();
        return matchesCategory && matchesDifficulty && haystack.includes(query.toLowerCase());
      }),
    [category, difficulty, query]
  );

  return (
    <div className="cosmic-bg flex-1">
      <div className="flex min-h-full flex-col">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
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

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-xs text-slate-500">Difficulty</span>
            {difficulties.map((item) => (
              <button
                key={item}
                onClick={() => setDifficulty(item)}
                className={`rounded-full px-3 py-1.5 text-xs ${difficulty === item ? "bg-white/10 font-medium text-white" : "text-slate-400 hover:bg-white/5"}`}
              >
                {item === "all" ? "Any" : item}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs text-slate-500">{results.length} loops · built for real work, not hype</p>

          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            {results.map((hustle) => (
              <HustleCard key={hustle.slug} hustle={hustle} />
            ))}
          </section>

          {results.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-white/10 bg-[#0e1318] p-10 text-center">
              <p className="text-lg font-medium">No loops match those filters yet.</p>
              <Link href="/earn" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                Clear the board <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}