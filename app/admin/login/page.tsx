import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import AdminLoginForm from "./login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    return (
      <main className="min-h-screen bg-[#07090c] px-6 py-20 text-white">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0e1318] p-6">
          <p className="text-sm text-lime-200">Already signed in</p>
          <h1 className="mt-3 text-2xl font-semibold">Admin access is ready.</h1>
          <Link href="/admin" className="mt-6 inline-flex rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950">
            Open admin studio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090c] px-6 py-20 text-white">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-xl font-semibold">
          Earn<span className="text-cyan-400">Loop</span>
        </Link>
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0e1318] p-6">
          <p className="text-sm font-medium text-cyan-300">Admin studio</p>
          <h1 className="mt-3 text-3xl font-semibold">Sign in to the control room.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Use an email configured in the server-only ADMIN_EMAILS allowlist. Password sign-in works once you have set one; otherwise use the magic link.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
