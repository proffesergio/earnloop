"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { slugifyMobilityName, type CountryGuide, type Opportunity, type RouteType } from "@/lib/scholarships";

const types: Array<"All" | RouteType> = ["All", "Scholarship", "Study portal", "Work route"];

export default function ScholarshipsExplorer({ opportunities, guides }: { opportunities: Opportunity[]; guides: CountryGuide[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const filtered = useMemo(
    () =>
      opportunities.filter(
        (item) =>
          (type === "All" || item.type === type) &&
          `${item.name} ${item.country} ${item.level}`.toLowerCase().includes(query.toLowerCase())
      ),
    [opportunities, query, type]
  );

  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-cyan-300">The mobility desk · scholarships, study and work</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Good opportunities. Better sources.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">Practical, editorial-style explainers for people planning their next international study or work move. We curate official programme, university and government pages—then you apply there directly.</p>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0e1318] p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 size-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country, degree or route"
              className="h-11 w-full rounded-xl bg-white/5 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:ring-1 focus:ring-cyan-300/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {types.map((item) => (
              <button
                key={item}
                onClick={() => setType(item)}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm ${type === item ? "bg-cyan-300 font-semibold text-slate-950" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="size-4 text-lime-300" /> {filtered.length} routes · links go to official sources · reviewed September 2026
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((item) => (
            <article key={item.name} className="flex flex-col rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-200">{item.type}</span>
                  <h2 className="mt-4 text-xl font-semibold">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{item.country} · {item.level}</p>
                </div>
                <ShieldCheck className="size-5 shrink-0 text-lime-300" />
              </div>
              <p className="mt-5 leading-7 text-slate-300">{item.summary}</p>
              <div className="mt-5 grid gap-3 border-y border-white/10 py-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Funding / route</p>
                  <p className="mt-1 text-slate-200">{item.funding}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Eligibility</p>
                  <p className="mt-1 text-slate-200">{item.eligibility}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                <strong className="text-slate-200">How to apply:</strong> {item.howToApply}
              </p>
              <Link href={`/scholarships/${slugifyMobilityName(item.name)}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                View detailed guide <ArrowRight className="size-4" />
              </Link>
              <a href={item.source} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white">
                {item.sourceLabel} <ArrowUpRight className="size-4" />
              </a>
            </article>
          ))}
        </section>

        <section className="mt-20">
          <p className="text-sm font-medium text-cyan-300">Study plans</p>
          <h2 className="mt-2 text-3xl font-semibold">Start with the country portal</h2>
          <p className="mt-3 max-w-2xl text-slate-400">Open a country guide for a practical study-plan checklist, document preparation notes, and official admission and visa links.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                href={`/scholarships/study-${slugifyMobilityName(guide.country)}`}
                key={guide.country}
                className="group rounded-2xl border border-white/10 bg-[#0e1318] p-5 hover:border-cyan-300/30"
              >
                <h3 className="font-semibold group-hover:text-cyan-200">{guide.country}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{guide.universities}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs text-cyan-200">
                  Open study plan <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="help" className="mt-20 rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <MessageCircle className="size-6 text-cyan-200" />
              <h2 className="mt-4 text-2xl font-semibold">Need a second pair of eyes?</h2>
              <p className="mt-2 max-w-xl leading-7 text-slate-300">
                Send us the country, degree level, subject, GPA and target intake. We can help you make a shortlist and spot missing steps. Never send your passport, password, OTP or bank details.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="rounded-xl bg-cyan-300 px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-cyan-200">Message on Facebook</a>
              <a href="https://wa.me/" target="_blank" rel="noreferrer" className="rounded-xl border border-white/15 px-5 py-3 text-center text-sm font-medium text-white hover:bg-white/5">WhatsApp community</a>
            </div>
          </div>
        </section>

        <p className="mt-8 text-xs leading-5 text-slate-600">
          Important: deadlines, eligibility, funding and immigration rules change. Verify the live call on the linked official source before applying. EarnLoop is an information service, not an immigration adviser, recruiter or legal representative.
        </p>
      </div>
    </div>
  );
}