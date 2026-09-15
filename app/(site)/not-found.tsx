import Link from "next/link";
import { Compass } from "lucide-react";

export default function SiteNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1318] p-8 text-center">
        <Compass className="mx-auto size-8 text-cyan-300" />
        <h1 className="mt-5 text-3xl font-semibold">404 · Loop not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The page you opened does not exist or was unpublished. The board still has plenty of loops worth testing.
        </p>
        <Link
          href="/earn"
          className="mt-7 inline-flex items-center justify-center rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
        >
          Back to the hustle board
        </Link>
      </div>
    </div>
  );
}