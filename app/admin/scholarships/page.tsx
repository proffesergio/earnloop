import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import ScholarshipManager from "./scholarship-manager";

export default async function ScholarshipsAdminPage() {
  if (!(await getAdminSession())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200">← Control room</Link>
        <p className="mt-8 text-sm font-medium text-cyan-300">Mobility desk</p>
        <h1 className="mt-2 text-4xl font-semibold">Scholarships and study plans</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Manage the public /scholarships hub: funding opportunities, work routes and country study guides. Data lives in Supabase (site_settings) and falls back to the curated seed until you publish your own.
        </p>
        <ScholarshipManager />
      </div>
    </main>
  );
}