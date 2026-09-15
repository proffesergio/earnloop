"use client";

import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";

type GeneratedHustle = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  difficulty: string;
  setupHoursBand: string;
  capitalBand: string;
  aiTools: string[];
  heroMetric?: string;
  overview: string;
  blueprint: Array<{ order: number; title: string; body: string; effortMinutes: number; isFreePreview: boolean }>;
};

const categories = ["content", "commerce", "freelance", "local", "apps"] as const;
const difficulties = ["easy", "medium", "hard"] as const;

export default function HustleStudio() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("commerce");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("easy");
  const [draft, setDraft] = useState<GeneratedHustle | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setStatus(null);
    const response = await fetch("/api/ai/hustle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, category, difficulty, capitalBand: "0" }),
    });
    const payload = (await response.json()) as { content?: GeneratedHustle; error?: string; message?: string };
    if (payload.content) {
      setDraft(payload.content);
      setStatus(`Saved as draft right now. Open "Manage content" to review, require a category, or publish.`);
    } else {
      setDraft(null);
      setStatus(payload.error ?? "Unable to generate a blueprint.");
    }
    setIsGenerating(false);
  }

  return (
    <section className="mt-6 rounded-2xl border border-lime-300/20 bg-lime-300/5 p-6">
      <div>
        <p className="flex items-center gap-2 text-sm font-medium text-lime-200">
          <Sparkles className="size-4" /> Hustle studio
        </p>
        <h2 className="mt-2 text-xl font-semibold">Generate a loop blueprint</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Turn a niche into a structured, Zod-validated hustle blueprint (overview, audience, steps, prompts, monetization, metrics). Nothing is published automatically.
        </p>
      </div>

      <form onSubmit={generate} className="mt-5 grid gap-3 sm:grid-cols-[1fr_140px_120px_auto]">
        <input
          required
          minLength={3}
          maxLength={240}
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="e.g. AI-assisted resume rewrites for nurses in the UK"
          className="h-11 rounded-xl border border-white/10 bg-[#07090c] px-3 text-sm text-white outline-none focus:border-lime-300/50"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as typeof category)}
          className="h-11 rounded-xl border border-white/10 bg-[#07090c] px-3 text-sm text-slate-200 outline-none focus:border-lime-300/50"
        >
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}
          className="h-11 rounded-xl border border-white/10 bg-[#07090c] px-3 text-sm text-slate-200 outline-none focus:border-lime-300/50"
        >
          {difficulties.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isGenerating}
          className="h-11 rounded-xl bg-lime-300 px-4 text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {isGenerating ? "Generating..." : "Generate blueprint"}
        </button>
      </form>

      {status ? <p className="mt-4 text-sm text-slate-300">{status}</p> : null}

      {draft ? (
        <div className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-[#07090c]/70 p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-lime-300/10 px-2 py-0.5 text-lime-200">{draft.category}</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-slate-300">{draft.difficulty}</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-slate-300">{draft.setupHoursBand} setup</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-slate-300">${draft.capitalBand} capital</span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold">{draft.title}</h3>
            <p className="mt-2 leading-7 text-slate-300">{draft.summary}</p>
            {draft.heroMetric ? <p className="mt-2 text-sm font-medium text-cyan-200">{draft.heroMetric}</p> : null}
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Overview</h4>
            <p className="mt-2 rounded-xl border border-white/10 bg-[#0e1318] p-4 text-sm leading-6 text-slate-300">{draft.overview}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Blueprint</h4>
            <ol className="mt-2 space-y-3">
              {draft.blueprint.map((step) => (
                <li key={step.order} className="rounded-xl border border-white/10 bg-[#0e1318] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-cyan-200">Step {step.order} · {step.title}</span>
                    <span className="text-xs text-slate-500">{step.effortMinutes} min</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Tools: {draft.aiTools.join(", ")}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}