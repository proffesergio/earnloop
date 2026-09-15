"use client";

import { useEffect, useState } from "react";

export function SeedCurationToggle() {
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/curation").then(async (response) => {
      const body = await response.json() as { enabled?: boolean; error?: string };
      if (!response.ok) throw new Error(body.error ?? "Unable to load curation setting.");
      setEnabled(body.enabled ?? true);
    }).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Unable to load curation setting."));
  }, []);

  async function toggle(next: boolean) {
    setLoading(true);
    setMessage(null);
    const response = await fetch("/api/admin/curation", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: next }) });
    const body = await response.json() as { enabled?: boolean; error?: string };
    if (!response.ok) setMessage(body.error ?? "Unable to save.");
    else { setEnabled(body.enabled ?? next); setMessage(body.enabled ? "Curated starter loops are on the public board." : "Only published admin hustles show on the public board."); }
    setLoading(false);
  }

  return (
    <aside className="mt-6 rounded-2xl border border-white/10 bg-[#0e1318] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Curated starter loops</p>
          <p className="mt-1 text-sm text-slate-400">When on, the three editorial seed loops ship alongside anything you publish. Turn off for a fully admin-controlled board.</p>
          {message ? <p className="mt-2 text-sm text-slate-300">{message}</p> : null}
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void toggle(!enabled)}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${enabled ? "border-lime-300/30 bg-lime-300/10 text-lime-200" : "border-white/10 bg-white/5 text-slate-300"}`}
        >
          {enabled ? "Seed loops: ON" : "Seed loops: OFF"}
        </button>
      </div>
    </aside>
  );
}