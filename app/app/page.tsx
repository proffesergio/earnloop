import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame, Gauge, Sparkles, Wallet } from "lucide-react";

const stats = [
  { label: "Current streak", value: "8 days", icon: Flame },
  { label: "XP this week", value: "420", icon: Gauge },
  { label: "Credits", value: "28", icon: Wallet }
] as const;

const tasks = [
  "Finish the niche validation step for your planner idea",
  "Publish one proof URL or mock listing",
  "Review your next offer and update one CTA"
] as const;

export default function AppDashboardPage() {
  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">Earn<span className="text-cyan-400">Loop</span></Link>
          <div className="hidden items-center gap-5 text-sm text-slate-300 sm:flex">
            <Link href="/earn" className="hover:text-white">Earn</Link>
            <Link href="/tools" className="hover:text-white">Tools</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-300">Loop dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Welcome back, operator.</h1>
          </div>
          <Link href="/earn" className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
            Open the board <ArrowRight className="size-4" />
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#0e1318] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{label}</p>
                <Icon className="size-4 text-cyan-300" />
              </div>
              <p className="mt-5 text-3xl font-semibold text-cyan-200">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Today&apos;s loop</h2>
              <Sparkles className="size-5 text-cyan-300" />
            </div>
            <ul className="mt-6 space-y-4">
              {tasks.map((task) => (
                <li key={task} className="flex gap-3 rounded-xl border border-white/10 bg-black/10 p-3 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 size-4 text-lime-300" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
            <Link href="/earn" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
              Continue the hustle <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
            <h2 className="text-xl font-semibold">EarnLoop principles</h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              <li>• Ship before you scale.</li>
              <li>• Keep proofs public and simple.</li>
              <li>• Spend credits on work, not idle scrolling.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
