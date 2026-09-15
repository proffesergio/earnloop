"use client";

import { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import type { CountryGuide, Opportunity, RouteType } from "@/lib/scholarships";

const routeTypes: RouteType[] = ["Scholarship", "Study portal", "Work route"];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#07090c] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/50";
const labelClass = "block text-xs text-slate-400";

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputClass} mt-1.5`} />
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

function ListArea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string[]; onChange: (value: string[]) => void; placeholder?: string; rows?: number }) {
  return (
    <label className="block sm:col-span-2">
      <span className={labelClass}>{label}</span>
      <textarea
        rows={rows}
        value={value.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n").map((line) => line.trim()).filter(Boolean))}
        placeholder={placeholder}
        className={`${inputClass} mt-1.5 leading-6`}
      />
    </label>
  );
}

function emptyOpportunity(): Opportunity {
  return { name: "", country: "", type: "Scholarship", level: "", funding: "", summary: "", eligibility: "", howToApply: "", source: "https://", sourceLabel: "", documents: [], steps: [] };
}

function emptyGuide(): CountryGuide {
  return { country: "", universities: "", portal: "https://", visa: "https://", summary: "", studySteps: [], documents: [] };
}

export default function ScholarshipManager() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [guides, setGuides] = useState<CountryGuide[]>([]);
  const [openOpps, setOpenOpps] = useState<boolean[]>([]);
  const [openGuides, setOpenGuides] = useState<boolean[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/scholarships").then(async (response) => {
      const payload = await response.json() as { opportunities?: Opportunity[]; guides?: CountryGuide[]; error?: string };
      if (!response.ok || !payload.opportunities || !payload.guides) throw new Error(payload.error ?? "Unable to load the mobility desk.");
      setOpportunities(payload.opportunities.map((item) => ({ ...item, documents: item.documents ?? [], steps: item.steps ?? [] })));
      setGuides(payload.guides.map((item) => ({ ...item, documents: item.documents ?? [], studySteps: item.studySteps ?? [] })));
      setOpenOpps(payload.opportunities.map(() => false));
      setOpenGuides(payload.guides.map(() => false));
    }).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Unable to load the mobility desk."));
  }, []);

  function patchOpportunity(index: number, patch: Partial<Opportunity>) {
    setOpportunities((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }
  function patchGuide(index: number, patch: Partial<CountryGuide>) {
    setGuides((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addOpportunity() {
    setOpportunities((current) => [...current, emptyOpportunity()]);
    setOpenOpps((current) => [...current, true]);
    setMessage(null);
  }
  function addGuide() {
    setGuides((current) => [...current, emptyGuide()]);
    setOpenGuides((current) => [...current, true]);
    setMessage(null);
  }
  function removeOpportunity(index: number) {
    setOpportunities((current) => current.filter((_, i) => i !== index));
    setOpenOpps((current) => current.filter((_, i) => i !== index));
  }
  function removeGuide(index: number) {
    setGuides((current) => current.filter((_, i) => i !== index));
    setOpenGuides((current) => current.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/scholarships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunities, guides }),
      });
      const payload = await response.json() as { message?: string; error?: string };
      setMessage(payload.message ?? payload.error ?? "Unable to save the mobility desk.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 space-y-8">
      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Scholarships, study and work routes</h2>
            <p className="mt-1 text-sm text-slate-400">Curated official opportunities are pre-loaded. Edit, add or remove them — saving publishes instantly on the public /scholarships desk.</p>
          </div>
          <button onClick={addOpportunity} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/5">
            <Plus className="size-4" /> Add route
          </button>
        </div>

        <div className="mt-6 divide-y divide-white/10">
          {opportunities.map((item, index) => (
            <div key={`${item.name}-${index}`} className="py-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpenOpps((current) => current.map((open, i) => (i === index ? !open : open)))}
                  className="flex-1 text-left"
                >
                  <span className="font-medium hover:text-cyan-200">{item.name || "Untitled route"}</span>
                  <span className="ml-2 text-xs text-slate-500">{item.country || "—"} · {item.type}{item.documents && item.documents.length > 0 ? ` · ${item.documents.length} docs` : ""}</span>
                </button>
                <button type="button" onClick={() => removeOpportunity(index)} className="text-xs text-rose-300 hover:text-rose-200">Delete</button>
              </div>
              {openOpps[index] ? (
                <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
                  <Field label="Name" value={item.name} onChange={(value) => patchOpportunity(index, { name: value })} />
                  <Field label="Country / region" value={item.country} onChange={(value) => patchOpportunity(index, { country: value })} />
                  <label className="block">
                    <span className={labelClass}>Type</span>
                    <select value={item.type} onChange={(event) => patchOpportunity(index, { type: event.target.value as RouteType })} className={`${inputClass} mt-1.5`}>
                      {routeTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </label>
                  <Field label="Level" value={item.level} onChange={(value) => patchOpportunity(index, { level: value })} />
                  <Field label="Funding / route" value={item.funding} onChange={(value) => patchOpportunity(index, { funding: value })} />
                  <Area label="Summary" value={item.summary} onChange={(value) => patchOpportunity(index, { summary: value })} />
                  <Area label="Eligibility" value={item.eligibility} onChange={(value) => patchOpportunity(index, { eligibility: value })} />
                  <Area label="How to apply" value={item.howToApply} onChange={(value) => patchOpportunity(index, { howToApply: value })} />
                  <Field label="Official source URL" value={item.source} onChange={(value) => patchOpportunity(index, { source: value })} />
                  <Field label="Source label" value={item.sourceLabel} onChange={(value) => patchOpportunity(index, { sourceLabel: value })} />
                  <ListArea label="Typical documents (one per line)" value={item.documents ?? []} onChange={(documents) => patchOpportunity(index, { documents })} />
                  <ListArea label="Application steps (one per line, optional)" value={item.steps ?? []} onChange={(steps) => patchOpportunity(index, { steps })} />
                </div>
              ) : null}
            </div>
          ))}
          {opportunities.length === 0 ? <p className="py-6 text-sm text-slate-500">No routes yet. Add the first one above.</p> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Country study plans</h2>
            <p className="mt-1 text-sm text-slate-400">Short country guides with official admission, visa and portal links.</p>
          </div>
          <button onClick={addGuide} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/5">
            <Plus className="size-4" /> Add country guide
          </button>
        </div>

        <div className="mt-6 divide-y divide-white/10">
          {guides.map((item, index) => (
            <div key={`${item.country}-${index}`} className="py-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpenGuides((current) => current.map((open, i) => (i === index ? !open : open)))}
                  className="flex-1 text-left"
                >
                  <span className="font-medium hover:text-cyan-200">{item.country || "Untitled country"}</span>
                  <span className="ml-2 text-xs text-slate-500">{item.studySteps.length} steps · {item.documents.length} docs</span>
                </button>
                <button type="button" onClick={() => removeGuide(index)} className="text-xs text-rose-300 hover:text-rose-200">Delete</button>
              </div>
              {openGuides[index] ? (
                <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
                  <Field label="Country" value={item.country} onChange={(value) => patchGuide(index, { country: value })} />
                  <Field label="Universities (comma separated)" value={item.universities} onChange={(value) => patchGuide(index, { universities: value })} />
                  <Field label="Study portal URL" value={item.portal} onChange={(value) => patchGuide(index, { portal: value })} />
                  <Field label="Visa guidance URL" value={item.visa} onChange={(value) => patchGuide(index, { visa: value })} />
                  <Area label="Summary" value={item.summary} onChange={(value) => patchGuide(index, { summary: value })} />
                  <ListArea label="Study plan steps (one per line)" value={item.studySteps} onChange={(studySteps) => patchGuide(index, { studySteps })} />
                  <ListArea label="Documents (one per line)" value={item.documents} onChange={(documents) => patchGuide(index, { documents })} />
                </div>
              ) : null}
            </div>
          ))}
          {guides.length === 0 ? <p className="py-6 text-sm text-slate-500">No country guides yet. Add the first one above.</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          Saving publishes the whole desk at once. Every route keeps its own slug — renamed items get a new URL.
        </p>
        <button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
          <Save className="size-4" /> {saving ? "Saving…" : "Publish mobility desk"}
        </button>
      </div>
      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </section>
  );
}