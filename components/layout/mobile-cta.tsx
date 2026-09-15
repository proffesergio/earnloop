"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileCta({ href = "/earn" }: { href?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.6;
      setVisible(scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#07090c]/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Link
        href={href}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 py-3 text-sm font-semibold text-slate-950"
      >
        Start a loop <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}