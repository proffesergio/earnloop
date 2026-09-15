"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { marketingNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090c]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Earn<span className="text-cyan-400">Loop</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-slate-300 lg:flex" aria-label="Main navigation">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 transition-colors hover:text-white",
                isActive(item.href) ? "bg-white/5 font-medium text-white" : "text-slate-300"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200"
          >
            Loop dashboard <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-white lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#07090c] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-1 text-sm" aria-label="Mobile navigation">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white",
                  isActive(item.href) ? "bg-white/5 font-medium text-white" : ""
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-between rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950"
            >
              Loop dashboard <ArrowRight className="size-4" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}