import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import ContentStudio from "./content-studio";

const modules = ["Overview", "Hustles", "Guides & news", "Prompt library", "Ads", "Settings"] as const;

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <div className="mx-auto max-w-7xl p-6 sm:p-10">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-xl font-semibold">
              Earn<span className="text-cyan-400">Loop</span>
            </Link>
            <p className="mt-3 text-sm text-cyan-300">Admin studio</p>
            <h1 className="mt-2 text-3xl font-semibold">Control room</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-lime-200">
              {session.user.email}
            </span>
            <Link href="/api/admin/sign-out" className="rounded-xl border border-white/15 px-3 py-2 text-slate-300 hover:bg-white/5">
              Sign out
            </Link>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-[#0e1318] p-3">
            <nav className="space-y-1">
              {modules.map((module, index) => (
                <div key={module} className={`rounded-xl px-3 py-3 text-sm ${index === 0 ? "bg-cyan-300/10 text-cyan-200" : "text-slate-400"}`}>
                  {module}
                </div>
              ))}
            </nav>
          </aside>

          <section>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["12", "Published guides"],
                ["04", "Needs review"],
                ["09", "Official mobility routes"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-[#0e1318] p-5">
                  <p className="text-3xl font-semibold text-cyan-200">{value}</p>
                  <p className="mt-2 text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0e1318] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Editorial queue</h2>
                  <p className="mt-1 text-sm text-slate-500">Draft → review → publish</p>
                </div>
                <button className="rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                  New content
                </button>
              </div>
              <div className="mt-5 divide-y divide-white/10">
                {[
                  ["Australia skilled routes", "Mobility route", "Review"],
                  ["7 AI workflows for freelancers", "Guide", "Draft"],
                  ["Study plan prompt pack", "Prompt library", "Published"],
                ].map(([title, kind, status]) => (
                  <div key={title} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="mt-1 text-xs text-slate-500">{kind} · updated today</p>
                    </div>
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs ${status === "Published" ? "bg-lime-300/10 text-lime-200" : status === "Review" ? "bg-amber-300/10 text-amber-200" : "bg-white/10 text-slate-400"}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ContentStudio />

            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-6">
              <h2 className="text-lg font-semibold text-amber-100">Allowlist access</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This session passed the server-only ADMIN_EMAILS check. Change the allowlist in Vercel or .env.local, then restart the server to apply it.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
