"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { id: string; slug: string; content_type: "hustle"; status: "draft" | "review" | "published"; title: string; summary: string; featured: boolean; updated_at: string };

export default function HustleList() {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    const controller = new AbortController();
    fetch(`/api/admin/hustles?${query}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as { items?: Item[]; error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load hustles.");
        setItems(payload.items ?? []);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Unable to load hustles.");
      });
    return () => controller.abort();
  }, [status, reloadKey]);

  async function updateStatus(item: Item, next: Item["status"]) {
    const response = await fetch(`/api/admin/hustles/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, status: next }) });
    if (!response.ok) { const body = await response.json() as { error?: string }; setError(body.error ?? "Could not change status."); return; }
    setReloadKey((key) => key + 1);
  }

  async function remove(item: Item) {
    if (!window.confirm(`Delete "${item.title}" permanently?`)) return;
    const response = await fetch(`/api/admin/hustles/${item.id}`, { method: "DELETE" });
    if (!response.ok) { const body = await response.json() as { error?: string }; setError(body.error ?? "Unable to delete."); return; }
    setReloadKey((key) => key + 1);
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0e1318]">
      <div className="flex flex-wrap gap-3 border-b border-white/10 p-4">
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-white/10 bg-[#07090c] px-3 py-2 text-sm"><option value="">All statuses</option><option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option></select>
      </div>
      {error ? <p className="p-6 text-sm text-rose-300">{error}</p> : items.length === 0 ? <p className="p-6 text-sm text-slate-400">No hustles match these filters yet. Generate one from the control room.</p> : <div className="divide-y divide-white/10">{items.map((item) => (
        <div key={item.id} className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <Link href={`/admin/hustles/${item.id}`} className="font-medium hover:text-cyan-200">{item.title}</Link>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">{item.content_type} · /{item.slug}{item.featured ? <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 text-cyan-200">featured</span> : null} · updated {new Date(item.updated_at).toLocaleDateString()}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs ${item.status === "published" ? "bg-lime-300/10 text-lime-200" : item.status === "review" ? "bg-amber-300/10 text-amber-200" : "bg-white/10 text-slate-400"}`}>{item.status}</span>
              {item.status !== "published" ? <button onClick={() => void updateStatus(item, "published")} className="rounded-lg bg-lime-300/10 px-3 py-1.5 text-xs font-medium text-lime-200 hover:bg-lime-300/20">Publish</button> : <button onClick={() => void updateStatus(item, "draft")} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5">Unpublish</button>}
              <Link href={`/admin/hustles/${item.id}`} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5">Edit</Link>
              <button onClick={() => void remove(item)} className="rounded-lg border border-rose-300/30 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-300/10">Delete</button>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-400">{item.summary}</p>
        </div>
      ))}</div>}
    </section>
  );
}