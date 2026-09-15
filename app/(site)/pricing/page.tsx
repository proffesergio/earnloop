import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Browse public hustles and learn the loop without paying.",
    features: ["Read public blueprints", "Use free tool demos", "Track your learning path"],
    featured: false
  },
  {
    name: "Loop+",
    price: "$12/mo",
    description: "Open the real work stack with more prompt access and premium service discounts.",
    features: ["Full prompt library", "Extra credits", "Priority service brief access"],
    featured: true
  },
  {
    name: "Credits",
    price: "$7+",
    description: "Use a small top-up when you want to run a tool or generate a starting asset.",
    features: ["Pay as you go", "No recurring lock-in", "Works for one-off runs"],
    featured: false
  }
] as const;

export default function PricingPage() {
  return (
    <div className="cosmic-bg flex-1">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-cyan-300">Simple pricing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Pay for output, not idle attention.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Interest is free. Real work is what earns proof, credits, and momentum.
          </p>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-6 ${plan.featured ? "border-cyan-300/40 bg-cyan-300/5" : "border-white/10 bg-[#0e1318]"}`}
            >
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-4 text-4xl font-semibold">{plan.price}</p>
              <p className="mt-3 text-sm text-slate-400">{plan.description}</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check className="mt-0.5 size-4 text-lime-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/app" className="mt-6 inline-flex items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                {plan.featured ? "Start Loop+" : "Choose plan"}
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
