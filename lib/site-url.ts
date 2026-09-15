function toUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function isLocalUrl(value: string): boolean {
  const url = toUrl(value);
  if (!url) return true;
  const hostname = url.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

/**
 * Resolves the public origin for redirects and magic links.
 *
 * Precedence:
 *  1. Any configured non-local URL (NEXT_PUBLIC_SITE_URL, then Vercel
 *     production/preview URLs) — this keeps the app on the live domain even
 *     when request headers are internal.
 *  2. The forwarded/request host when it is not localhost.
 *  3. The first configured candidate as a local-dev fallback.
 *
 * A localhost URL is never returned for a production-looking request; when the
 * request is genuinely local (dev server) localhost is preserved.
 */
export function getPublicOrigin(request: Request): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (!isLocalUrl(candidate)) {
      return candidate.replace(/\/$/, "");
    }
  }

  const fallback = candidates[0];
  if (fallback) {
    return fallback.replace(/\/$/, "");
  }

  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${forwardedProto}://${new URL(request.url).host}`;
}