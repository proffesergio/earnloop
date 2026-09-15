"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { prompts, type PromptCategory } from "@/lib/prompts";

const categories: Array<"All" | PromptCategory> = ["All", "Build", "Visuals", "Education", "Play"];

export default function PromptsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      prompts.filter(
        (item) =>
          (category === "All" || item.category === category) &&
          `${item.title} ${item.summary} ${item.tool}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query, category]
  );

  async function copyPrompt(prompt: string, title: string) {
    await navigator.clipboard.writeText(prompt);
    setCopied(title);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-cyan-300">Prompt library</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Better inputs. More useful outputs.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Reusable starting points for building, learning, visual storytelling and making fun things with AI.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0e1318] p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 size-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts, tools or tasks"
              className="h-11 w-full rounded-xl bg-white/5 pl-11 pr-4 text-sm outline-none focus:ring-1 focus:ring-cyan-300/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm ${category === item ? "bg-cyan-300 font-semibold text-slate-950" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">{filtered.length} prompts · copy, adapt, ship</p>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <article key={item.title} className="flex flex-col rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-200">{item.category}</span>
                <span className="text-xs text-slate-500">{item.tool}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{item.summary}</p>
              <pre className="mt-4 flex-1 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-300">
                {item.prompt}
              </pre>
              <button
                onClick={() => copyPrompt(item.prompt, item.title)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white"
              >
                {copied === item.title ? <Check className="size-4 text-lime-300" /> : <Copy className="size-4" />}
                {copied === item.title ? "Copied" : "Copy prompt"}
              </button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}