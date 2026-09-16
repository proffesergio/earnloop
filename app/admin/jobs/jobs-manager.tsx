"use client";

import { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import type { JobPosting } from "@/lib/job-contract";
import { defaultSourceVerification, isInternalEarnLoopUrl, isVerifiedSource } from "@/lib/source-verification";
import { SourceVerificationField, VerificationStatusLabel } from "@/components/admin/source-verification-field";

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

function emptyJob(): JobPosting {
  return {
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : `job-${Date.now()}`,
    title: "",
    company: "",
    category: "Remote jobs",
    location: "Remote",
    payBand: "",
    engagement: "",
    postedAt: "",
    applyUrl: "https://",
    sourceLabel: "",
    summary: "",
    requirements: [],
    howItWorks: [],
    tags: [],
    featured: false,
    verification: defaultSourceVerification(),
    seo: {},
  };
}

export default function JobsManager() {
  const [categories, setCategories] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [newCategory, setNewCategory] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/jobs").then(async (response) => {
      const payload = await response.json() as { categories?: string[]; jobs?: JobPosting[]; error?: string };
      if (!response.ok || !payload.categories || !payload.jobs) throw new Error(payload.error ?? "Unable to load the job board.");
      setCategories(payload.categories);
      setJobs(payload.jobs.map((item) => ({ ...item, requirements: item.requirements ?? [], howItWorks: item.howItWorks ?? [], tags: item.tags ?? [], verification: item.verification ?? defaultSourceVerification(), seo: item.seo ?? {} })));
    }).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Unable to load the job board."));
  }, []);

  function patchJob(id: string, patch: Partial<JobPosting>) {
    setJobs((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addJob(category?: string) {
    const job = emptyJob();
    if (category) job.category = category;
    setJobs((current) => [...current, job]);
    setOpenIds((current) => ({ ...current, [job.id]: true }));
    setMessage(null);
  }

  function removeJob(id: string) {
    setJobs((current) => current.filter((item) => item.id !== id));
    setOpenIds((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function addCategory() {
    const value = newCategory.trim();
    if (!value || categories.includes(value)) return;
    setCategories((current) => [...current, value]);
    setNewCategory("");
  }

  function removeCategory(category: string) {
    setCategories((current) => current.filter((item) => item !== category));
    setJobs((current) => current.map((item) => (item.category === category ? { ...item, category: "Remote jobs" } : item)));
  }

  async function save() {
    const unverified = jobs.filter((job) => !isInternalEarnLoopUrl(job.applyUrl) && !isVerifiedSource(job.verification));
    if (unverified.length > 0) {
      setMessage(
        `Source verification required before publishing. Confirm the 'Source verification' checkboxes on: ${unverified
          .map((job) => `“${job.title || "Untitled listing"}”`)
          .join(", ")}`
      );
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, jobs }),
      });
      const payload = await response.json() as { message?: string; error?: string };
      setMessage(payload.message ?? payload.error ?? "Unable to save the job board.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 space-y-8">
      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <div>
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="mt-1 text-sm text-slate-400">These become the filter chips and menu labels on the public /jobs page. Add your own any time.</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-slate-200">
              {category}
              <button type="button" onClick={() => removeCategory(category)} className="text-rose-300 hover:text-rose-200">×</button>
            </span>
          ))}
        </div>
        <div className="mt-4 flex max-w-sm gap-2">
          <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCategory(); } }} placeholder="New category name" className="flex-1 rounded-xl border border-white/10 bg-[#07090c] px-3 py-2 text-sm outline-none focus:border-cyan-300/50" />
          <button type="button" onClick={addCategory} className="rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/5">Add</button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Job and opportunity listings</h2>
            <p className="mt-1 text-sm text-slate-400">Curated listings are pre-loaded. Edit, add or remove them — saving publishes instantly on /jobs.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => addJob()} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/5">
              <Plus className="size-4" /> Add listing
            </button>
          </div>
        </div>

        <div className="mt-6 divide-y divide-white/10">
          {jobs.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpenIds((current) => ({ ...current, [item.id]: !current[item.id] }))}
                  className="flex-1 text-left"
                >
                  <span className="font-medium hover:text-cyan-200">{item.title || "Untitled listing"}</span>
                  <span className="ml-2 text-xs text-slate-500">{item.category} · {item.payBand || "no pay band"}{item.featured ? " · ★ featured" : ""}</span>
                  {item.verification ? <VerificationStatusLabel verification={item.verification} /> : null}
                </button>
                <button type="button" onClick={() => addJob(item.category)} className="text-xs text-slate-400 hover:text-white">Duplicate</button>
                <button type="button" onClick={() => removeJob(item.id)} className="text-xs text-rose-300 hover:text-rose-200">Delete</button>
              </div>
              {openIds[item.id] ? (
                <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
                  <Field label="Title" value={item.title} onChange={(value) => patchJob(item.id, { title: value })} />
                  <Field label="Company / client (optional)" value={item.company} onChange={(value) => patchJob(item.id, { company: value })} />
                  <label className="block">
                    <span className={labelClass}>Category</span>
                    <input list="job-categories" value={item.category} onChange={(event) => patchJob(item.id, { category: event.target.value })} className={`${inputClass} mt-1.5`} />
                  </label>
                  <Field label="Location" value={item.location} onChange={(value) => patchJob(item.id, { location: value })} />
                  <Field label="Pay band (honest range)" value={item.payBand} onChange={(value) => patchJob(item.id, { payBand: value })} />
                  <Field label="Engagement" value={item.engagement} onChange={(value) => patchJob(item.id, { engagement: value })} />
                  <Field label="Posted / updated label" value={item.postedAt} onChange={(value) => patchJob(item.id, { postedAt: value })} />
                  <Field label={`Apply URL (external link, or ${"earnloop.app"} for an internal blueprint)`} value={item.applyUrl} onChange={(value) => patchJob(item.id, { applyUrl: value })} />
                  <Field label="Source label" value={item.sourceLabel} onChange={(value) => patchJob(item.id, { sourceLabel: value })} />
                  <Area label="Summary" value={item.summary} onChange={(value) => patchJob(item.id, { summary: value })} />
                  <ListArea label="Requirements (one per line)" value={item.requirements} onChange={(requirements) => patchJob(item.id, { requirements })} />
                  <ListArea label="How it works (one per line)" value={item.howItWorks} onChange={(howItWorks) => patchJob(item.id, { howItWorks })} />
                  <ListArea label="Tags (one per line, optional)" value={item.tags} onChange={(tags) => patchJob(item.id, { tags })} />
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={item.featured} onChange={(event) => patchJob(item.id, { featured: event.target.checked })} className="accent-cyan-300" /> Featured (boosts on the board)
                  </label>
                  {isInternalEarnLoopUrl(item.applyUrl) ? (
                    <p className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-400 sm:col-span-2">
                      This applies through an EarnLoop blueprint (internal loop), so no external source check is needed. The public card will show no “Verified source” badge.
                    </p>
                  ) : (
                    <SourceVerificationField verification={item.verification} onChange={(verification) => patchJob(item.id, { verification })} />
                  )}
                  <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                    <Field label="SEO meta title (optional override)" value={item.seo.title ?? ""} onChange={(value) => patchJob(item.id, { seo: { ...item.seo, title: value || undefined } })} />
                    <Field label="SEO meta description (optional override)" value={item.seo.description ?? ""} onChange={(value) => patchJob(item.id, { seo: { ...item.seo, description: value || undefined } })} />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          {jobs.length === 0 ? <p className="py-6 text-sm text-slate-500">No listings yet. Add the first one above.</p> : null}
        </div>
        <datalist id="job-categories">
          {categories.map((category) => <option key={category} value={category} />)}
        </datalist>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          Saving publishes the whole board at once. Every listing keeps its own slug — renamed titles get a new URL.
        </p>
        <button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
          <Save className="size-4" /> {saving ? "Saving…" : "Publish job board"}
        </button>
      </div>
      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </section>
  );
}