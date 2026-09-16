import Link from "next/link";
import { marketingNav } from "@/lib/nav";

const resourceLinks = [
  { href: "/prompts", label: "Prompt library" },
  { href: "/jobs", label: "Jobs & gigs" },
  { href: "/scholarships", label: "Scholarships & work routes" },
  { href: "/tools", label: "Loop Builder" },
  { href: "/news", label: "Tips" },
  { href: "/pricing", label: "Pricing" },
] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
  { href: "/ai-notice", label: "AI content notice" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0e1318]/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Earn<span className="text-cyan-400">Loop</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
            Verified openings. Step-by-step routes. Real work, real proof — never overnight promises.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            {marketingNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Resources</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            {resourceLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Trust</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>EarnLoop · Built for honest, proof-first operators. Income is never guaranteed.</p>
          <p>Earnings overviews are educational. Do your own diligence before paying for anything.</p>
        </div>
      </div>
    </footer>
  );
}