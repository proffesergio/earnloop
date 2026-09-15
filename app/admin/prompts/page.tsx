import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import PromptManager from "./prompt-manager";

export default async function PromptsAdminPage() {
  if (!(await getAdminSession())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200">← Control room</Link>
        <p className="mt-8 text-sm font-medium text-cyan-300">Prompt library</p>
        <h1 className="mt-2 text-4xl font-semibold">Add prompts by category</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Manage the public /prompts library. The code seed renders out of the box; anything you add here is appended (or overrides by title) and appears live with its own category filter.
        </p>
        <PromptManager />
      </div>
    </main>
  );
}