"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Route } from "lucide-react";

export function RouteChecklist({
  steps,
  storageKey,
  title = "Follow the route, step by step",
}: {
  steps: string[];
  storageKey: string;
  title?: string;
}) {
  const storageKeyRef = useMemo(() => `el:route:${storageKey}`, [storageKey]);
  const [done, setDone] = useState<number[]>(() => {
    try {
      const raw = window.localStorage.getItem(storageKeyRef);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKeyRef, JSON.stringify(done));
    } catch {
      // storage unavailable — progress just won't persist
    }
  }, [storageKeyRef, done]);

  const progress = steps.length === 0 ? 0 : Math.round((done.length / steps.length) * 100);
  const complete = useMemo(() => steps.length > 0 && done.length === steps.length, [done.length, steps.length]);

  if (steps.length === 0) return null;

  function toggle(index: number) {
    setDone((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]));
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Route className="size-5 text-cyan-300" />
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${complete ? "bg-lime-300/15 text-lime-200" : "bg-white/5 text-slate-300"}`}>
          {done.length} / {steps.length} done{complete ? " — route completed" : ""}
        </span>
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-lime-300 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <ol className="mt-6 space-y-2">
        {steps.map((step, index) => {
          const checked = done.includes(index);
          return (
            <li key={step}>
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3.5 transition-colors ${checked ? "border-lime-300/25 bg-lime-300/[0.05]" : "hover:border-cyan-300/30"}`}>
                <input type="checkbox" checked={checked} onChange={() => toggle(index)} className="mt-1 size-4 shrink-0 accent-lime-300" />
                <span className={`text-sm leading-6 ${checked ? "text-slate-500 line-through" : "text-slate-200"}`}>
                  <span className="mr-2 font-mono text-xs text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </span>
                {checked ? <CheckCircle2 className="ml-auto size-4 shrink-0 text-lime-300" /> : null}
              </label>
            </li>
          );
        })}
      </ol>
    </section>
  );
}