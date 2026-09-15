import Link from "next/link";
import { ArrowRight, Palette, Rocket, Shirt, ShoppingBag } from "lucide-react";

const services = [
  {
    name: "Graphic design sprint",
    icon: Palette,
    summary: "Brand basics, social assets, and offer visuals for one focused service package.",
    price: "From $95"
  },
  {
    name: "Merch & print art",
    icon: Shirt,
    summary: "Simple product art, packaging, and mockups for digital goods or small-batch merchandise.",
    price: "From $140"
  },
  {
    name: "One-page site",
    icon: Rocket,
    summary: "A clean landing page for a hustle, service, or portfolio with clear offers and CTA blocks.",
    price: "From $220"
  },
  {
    name: "Custom brief",
    icon: ShoppingBag,
    summary: "For unusual requests, packaging, or product systems that need a custom kickoff call.",
    price: "Custom"
  }
] as const;

export default function ServicesPage() {
  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-cyan-300">Premium fulfillment</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Ship the part you do not want to do by hand.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Buy a service package when you need faster output, cleaner visuals, or a professional landing page behind a real offer.
          </p>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.name} className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
                <div className="flex items-center justify-between gap-3">
                  <Icon className="size-6 text-cyan-300" />
                  <span className="text-sm text-lime-200">{service.price}</span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold">{service.name}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{service.summary}</p>
                <Link href="/app" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                  Start a brief <ArrowRight className="size-4" />
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
