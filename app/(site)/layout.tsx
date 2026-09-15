import type { ReactNode } from "react";
import { AuroraBackdrop } from "@/components/background/aurora-backdrop";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileCta } from "@/components/layout/mobile-cta";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#07090c] text-white">
      <AuroraBackdrop />
      <SiteHeader />
      <main className="relative z-10 flex flex-1 flex-col">{children}</main>
      <SiteFooter />
      <MobileCta />
    </div>
  );
}