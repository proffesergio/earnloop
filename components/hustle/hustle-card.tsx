import Link from "next/link";
import { ArrowRight, Clock3, Coins } from "lucide-react";
import type { EarnLoopSideHustle } from "@/types/earnloop";

const difficultyTone: Record<string, string> = {
  easy: "text-lime-200",
  medium: "text-amber-200",
  hard: "text-rose-200",
};

export function HustleCard({ hustle }: { hustle: EarnLoopSideHustle }) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-[#0e1318] p-6 transition-colors hover:border-cyan-300/30">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-200">
          {hustle.category}
        </span>
        <span className={`text-xs font-medium ${difficultyTone[hustle.difficulty] ?? "text-slate-400"}`}>
          {hustle.difficulty}
        </span>
      </div>

      <h2 className="mt-4 text-2xl font-semibold">{hustle.title}</h2>
      <p className="mt-3 leading-7 text-slate-300">{hustle.summary}</p>

      <div className="mt-5 grid gap-3 border-y border-white/10 py-4 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Coins className="size-4 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Capital</p>
            <p className="mt-0.5 text-slate-200">${hustle.capitalBand}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="size-4 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500">Setup</p>
            <p className="mt-0.5 text-slate-200">{hustle.setupHoursBand} hrs</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span className="inline-flex flex-wrap gap-1">
          {hustle.aiTools.slice(0, 3).map((tool) => (
            <span key={tool} className="rounded-full border border-white/10 px-2 py-0.5">
              {tool}
            </span>
          ))}
        </span>
        <span className="font-medium text-lime-200">{hustle.xpCompletion} XP</span>
      </div>

      <Link
        href={`/earn/${hustle.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition-colors hover:text-white"
      >
        View loop <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}