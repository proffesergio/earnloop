"use client";

import { FormEvent, useState } from "react";

type GeneratedContent = {
  title: string;
  summary: string;
  sections: Array<{ heading: string; body: string }>;
  safetyNotes: string[];
};

export default function ContentStudio() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<"guide" | "opportunity" | "prompt">("guide");
  const [draft, setDraft] = useState<GeneratedContent | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setStatus(null);
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, contentType, audience: "solo operators and beginners", tone: "specific, honest, practical" }),
    });
    const payload = (await response.json()) as { content?: GeneratedContent; error?: string };
    setDraft(payload.content ?? null);
    setStatus(payload.content ? "Draft generated. Review every claim before publishing." : payload.error ?? "Unable to generate a draft.");
    setIsGenerating(false);
  }

  return (
    <section className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6">
      <div>
        <p className="text-sm font-medium text-cyan-200">Content studio</p>
        <h2 className="mt-2 text-xl font-semibold">Generate a review-ready post</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Create a structured draft for a side-hustle strategy, guide, or prompt. Nothing is published automatically.</p>
      </div>
      <form onSubmit={generate} className="mt-5 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
        <input required minLength={3} maxLength={240} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. selling a weekly content package to local cafes" className="h-11 rounded-xl border border-white/10 bg-[#07090c] px-3 text-sm text-white outline-none focus:border-cyan-300/50" />
        <select value={contentType} onChange={(event) => setContentType(event.target.value as typeof contentType)} className="h-11 rounded-xl border border-white/10 bg-[#07090c] px-3 text-sm text-slate-200 outline-none focus:border-cyan-300/50">
          <option value="guide">Guide</option>
          <option value="opportunity">Opportunity</option>
          <option value="prompt">Prompt pack</option>
        </select>
        <button type="submit" disabled={isGenerating} className="h-11 rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 disabled:opacity-60">{isGenerating ? "Generating..." : "Generate draft"}</button>
      </form>
      {status ? <p className="mt-4 text-sm text-slate-300">{status}</p> : null}
      {draft ? (
        <div className="mt-6 space-y-5 rounded-2xl border border-white/10 bg-[#07090c]/70 p-5">
          <div><h3 className="text-2xl font-semibold">{draft.title}</h3><p className="mt-2 leading-7 text-slate-300">{draft.summary}</p></div>
          <div className="space-y-4">{draft.sections.map((section) => <section key={section.heading}><h4 className="font-semibold text-cyan-200">{section.heading}</h4><p className="mt-1 text-sm leading-6 text-slate-300">{section.body}</p></section>)}</div>
          {draft.safetyNotes.length > 0 ? <div className="border-t border-white/10 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">Editorial checks</p><ul className="mt-2 space-y-1 text-sm text-slate-400">{draft.safetyNotes.map((note) => <li key={note}>• {note}</li>)}</ul></div> : null}
        </div>
      ) : null}
    </section>
  );
}
