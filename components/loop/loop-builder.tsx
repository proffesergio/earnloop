"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Target } from "lucide-react";

const HOURS_OPTIONS = [2, 5, 10, 20];

const PROOF_GOALS = [
  { value: "first-1", label: "First $1, or a first paid order" },
  { value: "first-reply", label: "First reply, interview invite, or admission to a closed programme" },
  { value: "first-proof", label: "First proof file (sample, draft, screenshot of the submission)" },
] as const;

const CHANNELS = [
  "The official source page itself — apply or sign up exactly where the listing points",
  "Direct email to 10 specific people who fit the listing",
  "A Slack, Discord, or Facebook group where the people in this listing ask questions",
  "Cold DM on X or LinkedIn — reply to an actual post, never a spam blast",
] as const;

function buildPlan(startingPoint: string, hours: number, goal: string, channel: string): string[] {
  return [
    `Audit the opening: open “${startingPoint}”, read it on the official page, and write one line for the pay, one line for what they require, and one honest line on why you might fit.`,
    `Verify the source: open the link in a fresh tab, confirm it is the official domain (not a lookalike or scraper), and save the deadline, pay, or “rolling” note to your notes file.`,
    `Build what it asks for: spend your ${hours} focused hours preparing exactly the items the listing requires — resume, work sample, form fields, or documents.`,
    `Ship it: submit or deliver through the official channel — ${channel}. Note the date and the confirmation reference. Day 4 is where real work begins.`,
    `Follow up once: 48–72 hours later send one polite, specific question and log the reply. A single follow-up is friendly; more is nagging.`,
    `Prove the week: capture proof — the submission screenshot, the delivered sample, the first reply, or your first $1. Write two sentences on exactly what happened.`,
    `Review and repeat: decide continue, change the approach, or stop. Pick the next opening from the Jobs board or the Mobility desk and run the loop again.`,
    `Honest checkpoint: your goal this week is ${goal} — not a promise of income. If you ran the steps and have a proof file or a reply, the loop worked.`,
  ];
}

export function LoopBuilder({
  suggestions,
}: {
  suggestions: Array<{ label: string; href: string }>;
}) {
  const [startingPoint, setStartingPoint] = useState("");
  const [hours, setHours] = useState<number>(5);
  const [goal, setGoal] = useState<string>(PROOF_GOALS[0].value);
  const [channel, setChannel] = useState<string>(CHANNELS[0]);
  const [planKey, setPlanKey] = useState<string | null>(null);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    if (!planKey) return;
    try {
      const steps = buildPlan(startingPoint, hours, goal, channel);
      window.localStorage.setItem(`el:loop-plan:${planKey}`, JSON.stringify({ steps, done }));
    } catch {
      // storage unavailable — plan just won't persist
    }
  }, [planKey, startingPoint, hours, goal, channel, done]);

  const plan = useMemo(() => {
    if (!planKey) return null;
    const steps = buildPlan(startingPoint, hours, goal, channel);
    return { steps, progress: steps.length === 0 ? 0 : Math.round((done.length / steps.length) * 100) };
  }, [planKey, startingPoint, hours, goal, channel, done]);

  function build() {
    if (startingPoint.trim().length < 3) return;
    const nextKey = `v1-${startingPoint.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}`;
    setPlanKey(nextKey);
    setDone([]);
    try {
      const raw = window.localStorage.getItem(`el:loop-plan:${nextKey}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { steps?: string[]; done?: number[] };
        if (Array.isArray(parsed.done)) setDone(parsed.done.filter((n): n is number => typeof n === "number"));
      }
    } catch {
      setDone([]);
    }
  }

  function reset() {
    setPlanKey(null);
    setDone([]);
  }

  function toggle(index: number) {
    setDone((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]));
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-[#07090c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50";
  const labelClass = "block text-xs font-medium uppercase tracking-[0.14em] text-slate-500";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <p className="text-sm font-semibold text-cyan-200">Step 1 · Pick a real opening or a niche</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">Start from a proven listing on EarnLoop, or type your own niche — the tool builds a 7-day action plan from it. No income promises.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.slice(0, 6).map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => {
                setStartingPoint(suggestion.label);
                setPlanKey(null);
              }}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                startingPoint === suggestion.label
                  ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100"
                  : "border-white/10 text-slate-300 hover:border-cyan-300/30"
              }`}
            >
              {suggestion.label}
            </button>
          ))}
        </div>
        <input
          value={startingPoint}
          onChange={(event) => {
            setStartingPoint(event.target.value);
            setPlanKey(null);
          }}
          placeholder="…or type your own opening / niche"
          className={`${inputClass} mt-4`}
        />

        <div className="mt-5">
          <span className={labelClass}>Step 2 · Real hours you can give this week</span>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {HOURS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setHours(option)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
                  hours === option
                    ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100"
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                }`}
              >
                {option}h
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <span className={labelClass}>Step 3 · Your proof goal for the week</span>
          <div className="mt-2 space-y-2">
            {PROOF_GOALS.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${
                  goal === option.value ? "border-cyan-300/60 bg-cyan-300/10" : "border-white/10 bg-white/[.03]"
                }`}
              >
                <input
                  type="radio"
                  name="goal"
                  checked={goal === option.value}
                  onChange={() => setGoal(option.value)}
                  className="mt-1 size-4 accent-cyan-300"
                />
                <span className="text-sm text-slate-200">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <span className={labelClass}>Step 4 · The one channel you will use</span>
          <div className="mt-2 space-y-2">
            {CHANNELS.map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${
                  channel === option ? "border-cyan-300/60 bg-cyan-300/10" : "border-white/10 bg-white/[.03]"
                }`}
              >
                <input
                  type="radio"
                  name="channel"
                  checked={channel === option}
                  onChange={() => setChannel(option)}
                  className="mt-1 size-4 accent-cyan-300"
                />
                <span className="text-sm text-slate-200">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={build}
          disabled={startingPoint.trim().length < 3}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Build my 7-day loop
          <ArrowRight className="size-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="size-5 text-cyan-300" />
            <h3 className="text-lg font-semibold">Your loop plan</h3>
          </div>
          {planKey && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:bg-white/5"
            >
              <RotateCcw className="size-3.5" />
              Start over
            </button>
          )}
        </div>

        {plan ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                {done.length} / {plan.steps.length} steps
              </span>
              <span className="font-medium text-cyan-200">{plan.progress}% complete</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${plan.progress}%` }} />
            </div>
            <ol className="space-y-2">
              {plan.steps.map((step, index) => {
                const checked = done.includes(index);
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        checked
                          ? "border-lime-300/40 bg-lime-300/5"
                          : "border-white/10 bg-white/[.03] hover:border-white/20"
                      }`}
                    >
                      {checked ? (
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-lime-300" />
                      ) : (
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-white/20 text-[10px] text-slate-400">
                          {index + 1}
                        </span>
                      )}
                      <span className={`text-sm leading-6 ${checked ? "text-slate-500 line-through" : "text-slate-200"}`}>
                        {step}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              The loop is honest: it rewards the work you actually did this week, never a promise of income. Tick steps as you complete them — proof of the work is your checkpoint.
            </p>
          </div>
        ) : (
          <div className="mt-8 flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-10 text-center">
            <Target className="size-8 text-cyan-300/60" />
            <p className="mt-4 text-sm font-medium text-slate-300">Your 7-day loop starts here</p>
            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
              Pick or type one opening, set your real hours, choose one proof goal, and press “Build my 7-day loop”. The plan is built from the method — no income promises, just seven honest days of work.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
