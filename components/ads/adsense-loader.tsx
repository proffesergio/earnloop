"use client";

import Script from "next/script";

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || null;

export function AdSenseLoader() {
  if (!client) return null;
  return (
    <Script
      async
      crossOrigin="anonymous"
      id="adsense-sdk"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="afterInteractive"
    />
  );
}