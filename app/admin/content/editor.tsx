"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EditorialInput } from "@/lib/content-contract";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0e1318] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/50";

const emptyContent: EditorialInput = { slug: "", title: "", dek: "", category: "Side hustle strategy", readTime: "5 min read", author: "EarnLoop editorial", contentType: "news", takeaways: [""], sections: [{ heading: "", paragraphs: [""] }], seo: {} };

export default function ContentEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [content, setContent] = useState<EditorialInput>(emptyContent);
  const [status, setStatus] = useState<"draft" | "review" | "published">("draft");
  const [featured, setFeatured] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/news-categories").then(async (response) => {
      const payload = await response.json() as { categories?: string[] };
      if (payload.categories) setCategories(payload.categories);
    }).catch(() => {});
    if (!id) return;
    fetch(`/api/admin/content/${id}`).then(async (response) => {
      const payload = await response.json() as { item?: { payload: EditorialInput; status: typeof status; featured: boolean }; error?: string };
      if (!response.ok || !payload.item) throw new Error(payload.error ?? "Unable to load content.");
      setContent(payload.item.payload); setStatus(payload.item.status); setFeatured(payload.item.featured);
    }).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Unable to load content."));
  }, [id]);

  function update(field: keyof EditorialInput, value: string) { setContent((current) => ({ ...current, [field]: value })); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage(null);
    const response = await fetch(id ? `/api/admin/content/${id}` : "/api/admin/content", { method: id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, status, featured }) });
    const payload = await response.json() as { id?: string; error?: string };
    if (!response.ok) setMessage(payload.error ?? "Unable to save content.");
    else { setMessage("Saved."); if (!id && payload.id) router.push(`/admin/content/${payload.id}`); }
    setSaving(false);
  }

  async function remove() {
    if (!id || !window.confirm("Delete this content permanently?")) return;
    const response = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
    if (!response.ok) { const payload = await response.json() as { error?: string }; setMessage(payload.error ?? "Unable to delete content."); return; }
    router.push("/admin/content");
  }

  const metaTitleLength = (content.seo.title ?? "").length;
  const metaDescLength = (content.seo.description ?? "").length;

  return <form onSubmit={save} className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
    <div className="space-y-5">
      <input required value={content.title} onChange={(event) => update("title", event.target.value)} placeholder="Post title" className="w-full rounded-xl border border-white/10 bg-[#0e1318] px-4 py-4 text-2xl font-semibold outline-none focus:border-cyan-300/50" />
      <textarea required value={content.dek} onChange={(event) => update("dek", event.target.value)} placeholder="Short summary / dek" rows={3} className="w-full rounded-xl border border-white/10 bg-[#0e1318] px-4 py-3 leading-7 outline-none focus:border-cyan-300/50" />
      <div className="grid gap-4 sm:grid-cols-3">
        <input required value={content.slug} onChange={(event) => update("slug", event.target.value)} placeholder="url-slug" className="rounded-xl border border-white/10 bg-[#0e1318] px-3 py-3 text-sm outline-none" />
        <input required value={content.category} onChange={(event) => update("category", event.target.value)} list="news-categories-editor" placeholder="Category" className="rounded-xl border border-white/10 bg-[#0e1318] px-3 py-3 text-sm outline-none" />
        <select value={content.contentType} onChange={(event) => setContent((current) => ({ ...current, contentType: event.target.value as "guide" | "news" }))} className="rounded-xl border border-white/10 bg-[#0e1318] px-3 py-3 text-sm"><option value="news">News</option><option value="guide">Guide</option></select>
      </div>
      <datalist id="news-categories-editor">
        {categories.map((category) => <option key={category} value={category} />)}
      </datalist>
      <textarea required value={content.takeaways.join("\n")} onChange={(event) => setContent((current) => ({ ...current, takeaways: event.target.value.split("\n") }))} placeholder="One takeaway per line" rows={4} className="w-full rounded-xl border border-white/10 bg-[#0e1318] px-4 py-3 text-sm leading-7 outline-none" />
      <textarea required value={content.sections.map((section) => `${section.heading}\n${section.paragraphs.join("\n")}`).join("\n\n")} onChange={(event) => setContent((current) => ({ ...current, sections: event.target.value.split("\n\n").map((block) => { const [heading, ...paragraphs] = block.split("\n"); return { heading: heading ?? "", paragraphs: paragraphs.filter(Boolean) }; }) }))} placeholder={"Section heading\nParagraph text\n\nAnother heading\nMore text"} rows={16} className="w-full rounded-xl border border-white/10 bg-[#0e1318] px-4 py-3 text-sm leading-7 outline-none" />

      <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
        <p className="text-sm font-semibold">On-page SEO (optional)</p>
        <p className="mt-1 text-xs text-slate-400">Used on /news/[slug] for search engines. Leave blank to fall back to the title and summary.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="block text-xs text-slate-400">Meta title ({metaTitleLength}/60)</span>
            <input value={content.seo.title ?? ""} onChange={(event) => setContent((c) => ({ ...c, seo: { ...c.seo, title: event.target.value || undefined } }))} placeholder="Under 60 characters, include the main keyword" className={`${inputClass} mt-1.5`} />
          </label>
          <label className="block">
            <span className="block text-xs text-slate-400">Meta description ({metaDescLength}/155)</span>
            <textarea value={content.seo.description ?? ""} onChange={(event) => setContent((c) => ({ ...c, seo: { ...c.seo, description: event.target.value || undefined } }))} placeholder="Under 155 characters, one clear sentence" rows={2} className={`${inputClass} mt-1.5 leading-6`} />
          </label>
        </div>
      </div>
    </div>
    <aside className="h-fit space-y-4 rounded-2xl border border-white/10 bg-[#0e1318] p-5"><p className="font-semibold">Publishing</p><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="w-full rounded-lg border border-white/10 bg-[#07090c] px-3 py-3 text-sm"><option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option></select><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Feature in newsroom</label><button disabled={saving} className="w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{saving ? "Saving..." : "Save content"}</button>{id ? <button type="button" onClick={remove} className="w-full rounded-xl border border-rose-300/30 px-4 py-3 text-sm text-rose-200 hover:bg-rose-300/10">Delete content</button> : null}{message ? <p className="text-sm text-slate-400">{message}</p> : null}</aside>
  </form>;
}