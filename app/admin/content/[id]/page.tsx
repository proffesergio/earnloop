import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import ContentEditor from "../editor";

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) redirect("/admin/login");
  const { id } = await params;
  return <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10"><div className="mx-auto max-w-7xl"><Link href="/admin/content" className="text-sm text-cyan-200">← Back to content</Link><h1 className="mt-8 text-4xl font-semibold">Edit editorial content</h1><ContentEditor id={id} /></div></main>;
}
