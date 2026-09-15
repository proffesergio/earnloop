import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import SourceImporter from "./source-importer";

export default async function ImportAdminPage() {
  if (!(await getAdminSession())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200">← Control room</Link>
        <p className="mt-8 text-sm font-medium text-cyan-300">Import tools</p>
        <h1 className="mt-2 text-4xl font-semibold">Scrape and import opportunity links</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Point the tool at a listing page (for example <code className="text-slate-300">opportunitiesradar.com</code>) or paste HTML from a page that blocks bots (like Facebook). Review the extracted items, then merge the ones you want into the Mobility desk.
        </p>
        <SourceImporter />
      </div>
    </main>
  );
}