"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1318] p-8 text-center">
        <AlertTriangle className="mx-auto size-8 text-amber-300" />
        <h1 className="mt-5 text-2xl font-semibold">Something broke in this loop.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The page hit an unexpected error. Reloading usually fixes it — nothing was published or charged.
        </p>
        <button
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
        >
          <RefreshCw className="size-4" /> Try again
        </button>
      </div>
    </div>
  );
}