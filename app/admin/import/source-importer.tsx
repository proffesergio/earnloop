"use client";

import { useState } from "react";
import { ArrowDownToLine, Globe2, Link2, RefreshCw } from "lucide-react";
import type { ImportCandidate } from "@/lib/importer/map";

type Mode = "url" | "html";
type Row = ImportCandidate & { selected: boolean };

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#07090c] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/50";
const labelClass = "block text-xs text-slate-400";

export default function SourceImporter() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [label, setLabel] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function fillRows(candidates: ImportCandidate[]) {
    setRows(candidates.map((candidate) => ({ ...candidate, selected: true })));
    setMessage(candidates.length ? `${candidates.length} items extracted. Edit and select the ones to keep.` : "No items found on that page. Try the Paste HTML tab for blocked sources.");
  }

  async function handleFetch() {
    setBusy(true);
    setMessage(null);
    setNote(null);
    try {
      const response = await fetch("/api/admin/import/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload = await response.json() as { candidates?: ImportCandidate[]; note?: string | null; suggestedLabel?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to fetch the page.");
      if (payload.suggestedLabel && !label) setLabel(payload.suggestedLabel);
      fillRows(payload.candidates ?? []);
      if (payload.note) setNote(payload.note);
    } catch (reason) {
      setNote(reason instanceof Error ? reason.message : "Unable to fetch the page.");
    } finally {
      setBusy(false);
    }
  }

  async function handleParse() {
    setBusy(true);
    setMessage(null);
    setNote(null);
    try {
      const response = await fetch("/api/admin/import/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });
      const payload = await response.json() as { candidates?: ImportCandidate[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to parse the HTML.");
      fillRows(payload.candidates ?? []);
    } catch (reason) {
      setNote(reason instanceof Error ? reason.message : "Unable to parse the HTML.");
    } finally {
      setBusy(false);
    }
  }

  function patchRow(index: number, patch: Partial<Row>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  const selectedCount = rows.filter((row) => row.selected).length;

  async function handleApply() {
    const chosen = rows.filter((row) => row.selected).map((row) => ({ name: row.name, source: row.source, summary: row.summary }));
    if (chosen.length === 0) {
      setMessage("Select at least one item to import.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/import/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidates: chosen, sourceLabel: label.trim() || "Imported listing" }),
      });
      const payload = await response.json() as { message?: string; error?: string; imported?: number };
      if (!response.ok) throw new Error(payload.error ?? "Unable to import.");
      setMessage(payload.message ?? `Imported ${payload.imported ?? 0} item(s).`);
      setRows((current) => current.filter((row) => !row.selected));
    } catch (reason) {
      setNote(reason instanceof Error ? reason.message : "Unable to import.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <div className="flex flex-wrap gap-2">
          {(["url", "html"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded-xl px-4 py-2 text-sm ${mode === item ? "bg-cyan-300 font-semibold text-slate-950" : "text-slate-400 hover:bg-white/5"}`}
            >
              {item === "url" ? "Fetch a URL" : "Paste HTML"}
            </button>
          ))}
        </div>

        {mode === "url" ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Link2 className="absolute left-4 top-3 size-4 text-slate-500" />
              <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://opportunitiesradar.com/ or https://www.facebook.com/Yopportunity" className={`${inputClass} pl-11`} />
            </div>
            <button onClick={() => void handleFetch()} disabled={busy || !url.trim()} className="rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60">
              <RefreshCw className="mr-2 inline size-4" />{busy ? "Fetching..." : "Fetch page"}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <label className="block">
              <span className={labelClass}>Page source (Ctrl/Cmd+U on the site, select all, paste here)</span>
              <textarea value={html} onChange={(event) => setHtml(event.target.value)} rows={6} placeholder="<html>…" className={`${inputClass} mt-1.5 font-mono text-xs leading-5`} />
            </label>
            <button onClick={() => void handleParse()} disabled={busy || !html.trim()} className="mt-3 rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60">
              {busy ? "Parsing..." : "Parse HTML"}
            </button>
          </div>
        )}

        <div className="mt-4">
          <label className="block">
            <span className={labelClass}>Source label (shown on the public Mobility pages)</span>
            <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="e.g. Opportunities Radar" className={`${inputClass} mt-1.5`} />
          </label>
        </div>
      </div>

      {note ? (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-sm leading-6 text-amber-100">
          <strong className="font-semibold">Heads up — </strong>{note}
        </div>
      ) : null}

      {message ? <p className="text-sm text-slate-400">{message}</p> : null}

      {rows.length > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-semibold text-cyan-200">Review and import · <span className="text-slate-300">{selectedCount} selected</span></p>
            <button onClick={() => void handleApply()} disabled={busy || selectedCount === 0} className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-60">
              <ArrowDownToLine className="size-4" />{busy ? "Importing..." : `Import ${selectedCount} into Mobility`}
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {rows.map((row, index) => (
              <div key={`${row.source}-${index}`} className="rounded-xl border border-white/10 bg-[#07090c]/60 p-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={row.selected} onChange={(event) => patchRow(index, { selected: event.target.checked })} className="mt-1 accent-lime-300" />
                  <div className="min-w-0 flex-1">
                    <input value={row.name} onChange={(event) => patchRow(index, { name: event.target.value })} className={`${inputClass} mb-2 font-medium`} />
                    <a href={row.source} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1.5 text-xs text-cyan-300 hover:text-white">
                      <Globe2 className="size-3.5 shrink-0" />
                      <span className="truncate">{row.source}</span>
                    </a>
                    <textarea value={row.summary} onChange={(event) => patchRow(index, { summary: event.target.value })} rows={2} placeholder="Short summary (optional — a default is generated)" className={`${inputClass} mt-2 leading-5`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}