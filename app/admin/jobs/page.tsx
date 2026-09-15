import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import JobsManager from "./jobs-manager";

export default async function JobsAdminPage() {
  if (!(await getAdminSession())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200">← Control room</Link>
        <p className="mt-8 text-sm font-medium text-cyan-300">Jobs & gigs</p>
        <h1 className="mt-2 text-4xl font-semibold">Opportunity board</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Manage the public /jobs hub: remote roles, virtual assistance, data entry and research, creative gigs, writing and proofreading, social media work, side-hustle loops and earning ideas. Data lives in Supabase (site_settings) and falls back to the curated seed until you publish your own.
        </p>
        <JobsManager />
      </div>
    </main>
  );
}