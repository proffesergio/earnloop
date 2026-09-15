"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { id: string; slug: string; content_type: "guide" | "news"; status: "draft" | "review" | "published"; title: string; summary: string; featured: boolean; updated_at: string };

export default function ContentList() {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (type) query.set("type", type);
    fetch(`/api/admin/content?${query}`).then(async (response) => {
      const payload = await response.json() as { items?: Item[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load content.");
      setItems(payload.items ?? []);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load content."));
  }, [status, type]);

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0e1318]">
      <div className="flex flex-wrap gap-3 border-b border-white/10 p-4">
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-white/10 bg-[#07090c] px-3 py-2 text-sm"><option value="">All statuses</option><option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option></select>
        <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-white/10 bg-[#07090c] px-3 py-2 text-sm"><option value="">Guides & news</option><option value="guide">Guides</option><option value="news">News</option></select>
      </div>
      {error ? <p className="p-6 text-sm text-rose-300">{error}</p> : items.length === 0 ? <p className="p-6 text-sm text-slate-400">No editorial content matches these filters.</p> : <div className="divide-y divide-white/10">{items.map((item) => <Link key={item.id} href={`/admin/content/${item.id}`} className="block p-5 hover:bg-white/[.03]"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.content_type} · /{item.slug} · updated {new Date(item.updated_at).toLocaleDateString()}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-xs ${item.status === "published" ? "bg-lime-300/10 text-lime-200" : item.status === "review" ? "bg-amber-300/10 text-amber-200" : "bg-white/10 text-slate-400"}`}>{item.status}</span></div><p className="mt-3 text-sm text-slate-400">{item.summary}</p></Link>)}</div>}
    </section>
  );
}
