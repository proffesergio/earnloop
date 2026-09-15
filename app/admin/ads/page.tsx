import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdsManager from "./ads-manager";

export default async function AdminAdsPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return (
    <main className="min-h-screen bg-[#07090c] p-6 text-white sm:p-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm text-cyan-200 hover:text-white">← Admin control room</Link>
        <div className="mt-8">
          <p className="text-sm text-cyan-300">Monetization</p>
          <h1 className="mt-2 text-4xl font-semibold">Ads & networks</h1>
          <p className="mt-3 max-w-2xl text-slate-400">AdSense powers the web app. This page is the easy-setup guide and the place to save AdMob IDs for a future native app.</p>
        </div>
        <AdsManager />
      </div>
    </main>
  );
}