"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import type { JobPosting } from "@/lib/job-contract";
import { sourceVerificationLabel } from "@/lib/source-verification";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isInternalJobUrl(url: string) {
  try {
    return new URL(url).host.includes("earnloop.app");
  } catch {
    return false;
  }
}

export default function JobsExplorer({ categories, jobs }: { categories: string[]; jobs: JobPosting[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return jobs.filter((job) => {
      if (activeCategory !== "All" && job.category !== activeCategory) return false;
      if (!needle) return true;
      return [job.title, job.company, job.summary, job.payBand, job.engagement, job.category, ...job.tags].join(" ").toLowerCase().includes(needle);
    });
  }, [jobs, activeCategory, query]);

  const featuredCount = filtered.filter((job) => job.featured).length;

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm ${activeCategory === category ? "bg-cyan-300 font-semibold text-slate-950" : "text-slate-400 hover:bg-white/5"}`}
          >
            {category}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by role, skill, company, pay or keyword…"
        className="w-full rounded-2xl border border-white/10 bg-[#0e1318] px-5 py-3.5 text-sm text-white outline-none focus:border-cyan-300/50"
      />

      <p className="text-sm text-slate-400">
        {filtered.length} listing{filtered.length === 1 ? "" : "s"}
        {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        {query ? ` matching “${query}”` : ""}
        {featuredCount ? ` · ${featuredCount} featured` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0e1318] p-10 text-center">
          <p className="text-lg font-semibold">No listings match your search.</p>
          <p className="mt-3 text-sm text-slate-400">Try a different category or keyword — the board updates as new roles and ideas come in.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((job, index) => {
            const slug = slugify(job.title);
            const internal = isInternalJobUrl(job.applyUrl);

            const card = (
              <article
                key={job.id}
                className={`flex flex-col rounded-2xl border bg-[#0e1318] p-6 ${
                  job.featured ? "border-cyan-300/25 bg-cyan-300/[0.04]" : "border-white/10"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-cyan-200">{job.category}</span>
                  {job.featured ? <span className="rounded-full bg-amber-300/10 px-2.5 py-1 text-amber-200">Featured</span> : null}
                  {job.verification?.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-300/10 px-2.5 py-1 text-lime-200" title="Checked against the official source">
                      <ShieldCheck className="size-3" /> {sourceVerificationLabel(job.verification)}
                    </span>
                  ) : null}
                  <span className="ml-auto text-slate-500">{job.postedAt}</span>
                </div>

                <h2 className="mt-4 text-xl font-semibold leading-snug">{job.title}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  {job.company ? <span>{job.company}</span> : null}
                  <span>{job.location}</span>
                  {job.engagement ? <span>{job.engagement}</span> : null}
                </div>

                <p className="mt-3 text-sm font-semibold text-lime-300">{job.payBand}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{job.summary}</p>

                {job.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">{tag}</span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/jobs/${slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
                  >
                    View listing <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5"
                  >
                    {internal ? "See the full loop" : "Apply now"} <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </article>
            );

            if ((index + 1) % 8 === 0) {
              return (
                <div key={job.id} className="space-y-5 md:col-span-2">
                  {card}
                  <AdSlot variant="in-article" />
                </div>
              );
            }
            return card;
          })}
        </div>
      )}
    </div>
  );
}