"use client";

import { useEffect, useState } from "react";

export default function NewsCategoriesManager() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/news-categories").then(async (response) => {
      const payload = await response.json() as { categories?: string[]; error?: string };
      if (!response.ok || !payload.categories) throw new Error(payload.error ?? "Unable to load categories.");
      setCategories(payload.categories);
    }).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Unable to load categories."));
  }, []);

  function addCategory() {
    const value = newCat.trim();
    if (!value || categories.includes(value)) return;
    setCategories((current) => [...current, value]);
    setNewCat("");
  }

  function removeCategory(category: string) {
    setCategories((current) => current.filter((item) => item !== category));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/news-categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      });
      const payload = await response.json() as { message?: string; error?: string };
      setMessage(payload.message ?? payload.error ?? "Unable to save categories.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#0e1318] p-6">
      <div>
        <h2 className="text-lg font-semibold">News categories</h2>
        <p className="mt-1 text-sm text-slate-400">These become the filter chips on /news and the dropdown in the content editor. Add your own any time — the seed is replaced as soon as you save your first change.</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span key={category} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-slate-200">
            {category}
            <button type="button" onClick={() => removeCategory(category)} className="text-rose-300 hover:text-rose-200">×</button>
          </span>
        ))}
        {categories.length === 0 ? <p className="text-sm text-slate-500">No categories added yet.</p> : null}
      </div>
      <div className="mt-4 flex max-w-sm gap-2">
        <input value={newCat} onChange={(event) => setNewCat(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCategory(); } }} placeholder="New category" className="flex-1 rounded-xl border border-white/10 bg-[#07090c] px-3 py-2 text-sm outline-none focus:border-cyan-300/50" />
        <button type="button" onClick={addCategory} className="rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/5">Add</button>
      </div>
      <div className="mt-4">
        <button onClick={() => void save()} disabled={saving || categories.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60">
          {saving ? "Saving…" : "Save categories"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-400">{message}</p> : null}
    </div>
  );
}