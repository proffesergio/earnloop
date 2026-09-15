import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import HustleList from "./hustle-list";
import { SeedCurationToggle } from "./seed-curation-toggle";

export default async function AdminHustlesPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return (
    <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm text-cyan-200 hover:text-white">← Admin control room</Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm text-cyan-300">Hustle CMS</p><h1 className="mt-2 text-4xl font-semibold">Earn blueprints</h1><p className="mt-3 text-slate-400">Review AI drafts, edit the payload, and publish loops to the public board.</p></div>
          <Link href="/admin" className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950">Generate a draft</Link>
        </div>
        <SeedCurationToggle />
        <HustleList />
      </div>
    </main>
  );
}