"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";

type EnvConfig = {
  client: string | null;
  slots: Record<"leaderboard" | "in-article" | "sidebar", string | null>;
};

type Saved = {
  client: string;
  slots: Record<"leaderboard" | "in-article" | "sidebar", string>;
  admobAndroid: string;
  admobIos: string;
};

const emptySaved: Saved = { client: "", slots: { leaderboard: "", "in-article": "", sidebar: "" }, admobAndroid: "", admobIos: "" };

export default function AdsManager() {
  const [env, setEnv] = useState<EnvConfig | null>(null);
  const [saved, setSaved] = useState<Saved>(emptySaved);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/ads", { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as { env: EnvConfig | null; saved: Saved | null; error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load ad settings.");
        setEnv(payload.env);
        setSaved(payload.saved ?? emptySaved);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setMessage(reason instanceof Error ? reason.message : "Unable to load ad settings.");
      });
    return () => controller.abort();
  }, []);

  function setSlot(key: "leaderboard" | "in-article" | "sidebar", value: string) {
    setSaved((current) => ({ ...current, slots: { ...current.slots, [key]: value } }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    const response = await fetch("/api/admin/ads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saved),
    });
    const payload = await response.json() as { saved?: Saved; error?: string };
    if (!response.ok) setMessage(payload.error ?? "Unable to save ad settings.");
    else { setSaved(payload.saved ?? saved); setMessage("Saved. These values are for reference and future app builds."); }
    setSaving(false);
  }

  const count = (value: string | null | undefined) => (value && value.trim() ? "ready" : "missing");

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
          <p className="text-sm font-semibold text-cyan-200">Live web config (environment)</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Public pages render AdSense only when these are set on Vercel or in .env.local. Empty values show a labeled placeholder.</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3"><dt className="text-slate-400">Publisher ID (<code>NEXT_PUBLIC_ADSENSE_CLIENT</code>)</dt><dd className={env?.client ? "text-lime-200" : "text-amber-200"}>{env?.client ? env.client : "not set"}</dd></div>
            {(["leaderboard", "in-article", "sidebar"] as const).map((slot) => (
              <div key={slot} className="flex items-center justify-between gap-3"><dt className="text-slate-400 capitalize">Slot — {slot.replace("-", " ")}</dt><dd className={count(env?.slots[slot]) === "ready" ? "text-lime-200" : "text-amber-200"}>{env?.slots[slot] ?? "not set"}</dd></div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
          <p className="text-sm font-semibold text-cyan-200">Saved settings (Supabase)</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Stored in <code>site_settings</code> for your records and for a future native app. Web ads use the environment values above.</p>
          <form onSubmit={save} className="mt-5 grid gap-3">
            <input value={saved.client} onChange={(event) => setSaved((current) => ({ ...current, client: event.target.value }))} placeholder="ca-pub-XXXXXXXXXXXX" className="rounded-xl border border-white/10 bg-[#07090c] px-3 py-3 text-sm outline-none focus:border-cyan-300/50" />
            <div className="grid gap-3 sm:grid-cols-3">
              {(["leaderboard", "in-article", "sidebar"] as const).map((slot) => (
                <input key={slot} value={saved.slots[slot]} onChange={(event) => setSlot(slot, event.target.value)} placeholder={slot} className="rounded-xl border border-white/10 bg-[#07090c] px-3 py-3 text-sm outline-none focus:border-cyan-300/50" />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={saved.admobAndroid} onChange={(event) => setSaved((current) => ({ ...current, admobAndroid: event.target.value }))} placeholder="AdMob Android app ID (future)" className="rounded-xl border border-white/10 bg-[#07090c] px-3 py-3 text-sm outline-none focus:border-cyan-300/50" />
              <input value={saved.admobIos} onChange={(event) => setSaved((current) => ({ ...current, admobIos: event.target.value }))} placeholder="AdMob iOS app ID (future)" className="rounded-xl border border-white/10 bg-[#07090c] px-3 py-3 text-sm outline-none focus:border-cyan-300/50" />
            </div>
            <button disabled={saving} className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{saving ? "Saving..." : "Save settings"}</button>
            {message ? <p className="text-sm text-slate-400">{message}</p> : null}
          </form>
        </div>
      </section>

      <SetupStep clientId={env?.client ?? ''}/>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#0e1318] p-6">
        <p className="text-sm font-semibold text-cyan-200">Where the slots render</p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
          <li>• <strong className="text-white">leaderboard</strong> — top of the earn board, the prompts library, and scholarship country-guide pages.</li>
          <li>• <strong className="text-white">in-article</strong> — mid-page break on news posts and scholarship details, inside the tool kit, plus an in-feed break every ninth prompt card.</li>
          <li>• <strong className="text-white">sidebar</strong> — desktop sidebar rail on long-form scholarship pages.</li>
        </ul>
        <p className="mt-4 text-xs leading-6 text-slate-500">
          Slots render whether or not a real unit is configured: an empty publisher ID shows a labeled placeholder, so every placement is always ready. Add the environment variables and redeploy, and placeholders become live AdSense units automatically.
        </p>
      </section>
    </>
  );
}

function SetupStep({ clientId }: { clientId: string }) {
  return (
    <section className="mt-6 rounded-2xl border border-lime-300/20 bg-lime-300/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-lime-200">Minimal AdSense setup (≈ 10 minutes)</p>
          <p className="mt-1 text-sm text-slate-400">Create a unit, paste two IDs, redeploy. Placeholders disappear automatically.</p>
        </div>
        {clientId ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-300/10 px-3 py-1.5 text-xs font-medium text-lime-200"><CheckCircle2 className="size-4" /> Publisher ID detected</span>
        ) : null}
      </div>
      <ol className="mt-6 grid gap-4 text-sm leading-7 text-slate-300 md:grid-cols-2">
        <li className="rounded-xl border border-white/10 bg-[#07090c]/60 p-4"><strong className="block text-white">1. Create the AdSense account</strong>Sign up at adsense.google.com, add your domain, and wait for approval. You only need <em>one</em> account.</li>
        <li className="rounded-xl border border-white/10 bg-[#07090c]/60 p-4"><strong className="block text-white">2. Create ad units</strong>Ads → Ad units. Make three responsive units labelled <code>leaderboard</code>, <code>in-article</code>, and <code>sidebar</code>, and copy each slot ID (<code className="text-slate-400">XXXXXXXXXXXXXXXX</code>).</li>
        <li className="rounded-xl border border-white/10 bg-[#07090c]/60 p-4"><strong className="block text-white">3. Add environment variables</strong><EnvCode env="NEXT_PUBLIC_ADSENSE_CLIENT" value={clientId}/><EnvCode env="NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD"/><EnvCode env="NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE"/><EnvCode env="NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR"/></li>
        <li className="rounded-xl border border-white/10 bg-[#07090c]/60 p-4"><strong className="block text-white">4. Redeploy</strong>Push to Vercel (or restart dev) and open a scholarship detail page. The labeled placeholder becomes a real ad unit.</li>
      </ol>
      <p className="mt-5 text-xs leading-6 text-slate-500">Before AdSense approval, alternative networks (Ezoic, Adsterra, Media.net) can serve the same slots — swap the unit script in <code>components/ads/ad-slot.tsx</code>. AdMob stays for the native app only and is never loaded in the browser.<a href="https://support.google.com/adsense/answer/10094736" target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 text-cyan-200"><ExternalLink className="size-3" /> AdSense help</a></p>
    </section>
  );
}

function EnvCode({ env, value }: { env: string; value?: string }) {
  const [copied, setCopied] = useState(false);
  const text = value ? `${env}=${value}` : `${env}=`;
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ }
  }
  return (
    <button type="button" onClick={() => void copy()} className="mt-2 flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-left text-xs text-slate-300">
      <code className="break-all">{text}</code>
      <span className="inline-flex shrink-0 items-center gap-1 text-slate-500">{copied ? <CheckCircle2 className="size-3 text-lime-300" /> : <Copy className="size-3" />}{copied ? "copied" : "copy"}</span>
    </button>
  );
}