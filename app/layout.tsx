import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AdSenseLoader } from "@/components/ads/adsense-loader";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || null;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://earnloop-kappa.vercel.app",
  ),
  verification: {
    other: adsenseClient
      ? { "google-adsense-account": adsenseClient }
      : {},
  },
  title: {
    default: "EarnLoop · AI side hustles, proven blueprints",
    template: "%s · EarnLoop",
  },
  description:
    "Searchable hub of AI side-hustle blueprints with credit-gated tools, prompts, and proof-first loops for solo operators.",
  openGraph: {
    siteName: "EarnLoop",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        spaceGrotesk.variable,
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-[#07090c]">
        {children}
        <AdSenseLoader />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? (
          <Script
            defer
            src={
              process.env.NEXT_PUBLIC_UMAMI_SRC ??
              "https://cloud.umami.is/script.js"
            }
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
