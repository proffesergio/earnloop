"use client";

import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";
import { getAdsConfig, type AdSlotVariant } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

export function AdSlot({ variant, className }: { variant: AdSlotVariant; className?: string }) {
  const { client, slots } = getAdsConfig();

  if (variant === "multiplex") {
    const multiplexSlot = slots.multiplex;
    if (!client || !multiplexSlot) {
      return <PlaceholderBox className={className} />;
    }
    return <AdsbyGoogleUnit client={client} slot={multiplexSlot} format="autorelaxed" className={className} />;
  }

  const slot = slots[variant];

  if (!client || !slot) {
    return <PlaceholderBox className={className} />;
  }

  return <AdsbyGoogleUnit client={client} slot={slot} format="auto" className={className} />;
}

function PlaceholderBox({ className }: { className?: string }) {
  return (
    <div
      role="complementary"
      aria-label="Advertisement placeholder"
      className={cn(
        "flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[.02] px-6 py-8 text-center",
        className
      )}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Advertisement</p>
      <p className="max-w-sm text-xs leading-5 text-slate-600">
        Ad space. Connect Google AdSense in Admin → Ads to display a real unit here.
      </p>
    </div>
  );
}

function AdsbyGoogleUnit({
  client,
  slot,
  format,
  className,
}: {
  client: string;
  slot: string;
  format: "auto" | "autorelaxed";
  className?: string;
}) {
  const id = useId();

  useEffect(() => {
    const target = window.document.getElementById(id);
    if (!target) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense blocks double-push; ignore so render never crashes.
    }
  }, [id]);

  return (
    <div className={className}>
      <ins
        id={id}
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
