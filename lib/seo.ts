import type { Metadata } from "next";

const DEFAULT_ORIGIN = "https://earnloop.app";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_ORIGIN).replace(/\/$/, "");
}

export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${clean === "/" ? "" : clean}`;
}

export type PageMetaInput = { title: string; description: string; path: string };

export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "EarnLoop",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export type LdListItem = { name: string; url?: string };

export function itemListStructuredData(items: LdListItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { url: item.url } : {}),
    })),
  };
}

export type ArticleStructuredData = {
  headline: string;
  description: string;
  path: string;
  author: string;
  datePublished?: string;
};

export function articleStructuredData({
  headline,
  description,
  path,
  author,
  datePublished,
}: ArticleStructuredData): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    ...(datePublished ? { datePublished } : {}),
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Organization", name: "EarnLoop" },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbStructuredData(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}