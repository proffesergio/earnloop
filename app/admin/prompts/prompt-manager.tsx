"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react";
import { prompts, type Prompt } from "@/lib/prompts";
import type { StoredPrompt } from "@/lib/prompt-contract";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#07090c] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/50";
const labelClass = "block text-xs text-slate-400";

function nextId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function Field({ label, value, onChange, placeholder, list }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; list?: string }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input list={list} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputClass} mt-1.5`} />
    </label>
  );
}

function Area({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }) {
  return (
    <label className="block sm:col-span-2">
      <span className={labelClass}>{label}</span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputClass} mt-1.5 leading-6`} />
    </label>
  );
}

function emptyPrompt(): StoredPrompt {
  return { id: nextId(), title: "", category: "", tool: "ChatGPT / Gemini / Claude", summary: "", prompt: "", active: true };
}

export default function PromptManager() {
  const [seed, setSeed] = useState<Prompt[]>(prompts);
  const [additions, setAdditions] = useState<StoredPrompt[]>([]);
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/prompts").then(async (response) => {
      const payload = await response.json() as { seed?: Prompt[]; additions?: StoredPrompt[]; error?: string };
      if (!response.ok || !payload.seed) throw new Error(payload.error ?? "Unable to load the prompt library.");
      setSeed(payload.seed);
      setAdditions(payload.additions ?? []);
    }).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Unable to load the prompt library."));
  }, []);

  const categorySuggestions = useMemo(() => {
    const seen = new Set<string>();
    for (const item of seed) seen.add(item.category);
    for (const item of additions) if (item.category.trim()) seen.add(item.category.trim());
    return Array.from(seen).sort();
  }, [seed, additions]);

  function patch(id: string, patch: Partial<StoredPrompt>) {
    setAdditions((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addPrompt() {
    const entry = emptyPrompt();
    setAdditions((current) => [...current, entry]);
    setOpenIds((current) => ({ ...current, [entry.id]: true }));
    setMessage(null);
  }

  function removePrompt(id: string) {
    setAdditions((current) => current.filter((item) => item.id !== id));
    setOpenIds((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function toggleOpen(id: string) {
    setOpenIds((current) => ({ ...current, [id]: !current[id] }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/prompts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ additions }),
      });
      const payload = await response.json() as { message?: string; error?: string };
      setMessage(payload.message ?? payload.error ?? "Unable to save the prompt library.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 space-y-8">
      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your prompts</h2>
            <p className="mt-1 text-sm text-slate-400">
              Stored in Supabase ({additions.length} additions) and merged with the code seed on /prompts. Categories are free-form — new ones appear as filters automatically.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => void save()} disabled={saving} className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60">
              <Save className="mr-2 inline size-4" />{saving ? "Saving..." : "Save library"}
            </button>
            <button onClick={addPrompt} className="rounded-xl border border-cyan-300/40 px-4 py-2.5 text-sm font-semibold text-cyan-200 hover:bg-cyan-300/10">
              <Plus className="mr-2 inline size-4" />New prompt
            </button>
          </div>
        </div>
        {message ? <p className="mt-4 text-sm text-slate-400">{message}</p> : null}
      </div>

      <datalist id="prompt-categories">
        {categorySuggestions.map((category) => <option key={category} value={category} />)}
      </datalist>

      {additions.length > 0 ? (
        <div className="space-y-4">
          {additions.map((item) => {
            const open = Boolean(openIds[item.id]);
            return (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => toggleOpen(item.id)} className="rounded-lg border border-white/15 p-1.5 text-slate-400 hover:text-white">
                      {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${item.category ? "bg-cyan-300/10 text-cyan-200" : "bg-white/10 text-slate-500"}`}
                    >
                      {item.category || "uncategorised"}
                    </span>
                    <span className="max-w-md truncate font-medium">{item.title || "Untitled prompt"}</span>
                    {!item.active ? <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-500">draft</span> : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-xs text-slate-400">
                      <input type="checkbox" checked={item.active} onChange={(event) => patch(item.id, { active: event.target.checked })} className="accent-cyan-300" />
                      Live
                    </label>
                    <button type="button" onClick={() => removePrompt(item.id)} className="rounded-lg border border-white/15 p-1.5 text-slate-500 hover:text-red-300">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                {open ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Field label="Title" value={item.title} onChange={(value) => patch(item.id, { title: value })} placeholder="Name the prompt" />
                    <Field label="Category" value={item.category} onChange={(value) => patch(item.id, { category: value })} list="prompt-categories" placeholder="e.g. Build, Earn, Marketing" />
                    <Field label="Recommended tool" value={item.tool} onChange={(value) => patch(item.id, { tool: value })} />
                    <Field label="One-line summary" value={item.summary} onChange={(value) => patch(item.id, { summary: value })} />
                    <Area label="Prompt text (paste the full prompt)" value={item.prompt} onChange={(value) => patch(item.id, { prompt: value })} rows={5} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0e1318]/50 p-10 text-center">
          <p className="text-sm text-slate-400">No custom prompts yet. Add one to extend the library with your own categories.</p>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <p className="text-sm font-semibold text-cyan-200">Code seed ({seed.length} prompts)</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          These ship with the app and cannot be edited here. Merge rules: a stored prompt with the same title overrides the seed; drafts are hidden on /prompts.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {seed.map((item) => (
            <span key={item.title} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300">{item.title}</span>
          ))}
        </div>
      </div>
    </section>
  );
}