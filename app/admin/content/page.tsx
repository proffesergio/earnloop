import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import ContentList from "./content-list";

export default async function AdminContentPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return (
    <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200 hover:text-white">← Admin control room</Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm text-cyan-300">Editorial CMS</p><h1 className="mt-2 text-4xl font-semibold">Guides & news</h1><p className="mt-3 text-slate-400">Draft, review, and publish practical content from one queue.</p></div>
          <Link href="/admin/content/new" className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950">New post</Link>
        </div>
        <ContentList />
      </div>
    </main>
  );
}
