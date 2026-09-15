import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import HustleEditor from "../hustle-editor";

export default async function EditHustlePage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) redirect("/admin/login");
  const { id } = await params;
  return <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10"><div className="mx-auto max-w-7xl"><Link href="/admin/hustles" className="text-sm text-cyan-200">← Back to hustles</Link><h1 className="mt-8 text-4xl font-semibold">Edit hustle blueprint</h1><HustleEditor id={id} /></div></main>;
}