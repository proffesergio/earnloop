"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SideHustleInput } from "@/lib/hustle-contract";

type Status = "draft" | "review" | "published";
type Payload = SideHustleInput;

export default function HustleEditor({ id }: { id: string }) {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [status, setStatus] = useState<Status>("draft");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [json, setJson] = useState("");

  useEffect(() => {
    fetch(`/api/admin/hustles/${id}`).then(async (response) => {
      const body = await response.json() as { item?: { payload: Payload; status: Status; featured: boolean }; error?: string };
      if (!response.ok || !body.item) throw new Error(body.error ?? "Unable to load the hustle.");
      setPayload(body.item.payload);
      setStatus(body.item.status);
      setJson(JSON.stringify(body.item.payload, null, 2));
    }).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Unable to load the hustle."));
  }, [id]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    let next: Payload;
    try {
      next = JSON.parse(json) as Payload;
    } catch {
      setMessage("Payload is not valid JSON.");
      setSaving(false);
      return;
    }
    const response = await fetch(`/api/admin/hustles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const body = await response.json() as { error?: string };
    if (!response.ok) setMessage(body.error ?? "Unable to save the hustle.");
    else { setPayload(next); setMessage("Saved. Toggle Publish below to go live."); }
    setSaving(false);
  }

  async function publish(change: Status) {
    if (!payload) return;
    setSaving(true);
    setMessage(null);
    const response = await fetch(`/api/admin/hustles/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: change }),
    });
    const body = await response.json() as { error?: string };
    if (!response.ok) setMessage(body.error ?? "Unable to change status.");
    else { setStatus(change); setMessage(change === "published" ? "Published. It is now live on /earn." : `Status: ${change}.`); }
    setSaving(false);
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
      <form onSubmit={save} className="space-y-4">
        <textarea value={json} onChange={(event) => setJson(event.target.value)} rows={24} spellCheck={false} className="w-full rounded-xl border border-white/10 bg-[#0e1318] px-4 py-3 font-mono text-xs leading-6 text-slate-300 outline-none focus:border-cyan-300/50" />
        <button disabled={saving} className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{saving ? "Saving..." : "Validate & save JSON"}</button>
      </form>
      <aside className="h-fit space-y-4 rounded-2xl border border-white/10 bg-[#0e1318] p-5">
        <p className="font-semibold">Publishing</p>
        <p className="text-xs leading-5 text-slate-400">Payload must pass the side-hustle schema (slug, title, summary, blueprint, prompts, monetization, metrics).</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => void publish("published")} disabled={saving || status === "published"} className="rounded-xl bg-lime-300/10 px-4 py-3 text-sm font-semibold text-lime-200 hover:bg-lime-300/20 disabled:opacity-50">Publish</button>
          <button onClick={() => void publish("draft")} disabled={saving || status === "draft"} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50">Unpublish</button>
        </div>
        <p className="text-xs capitalize text-slate-500">Status: {status}</p>
        {message ? <p className="text-sm text-slate-400">{message}</p> : null}
      </aside>
    </div>
  );
}