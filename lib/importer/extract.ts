import "server-only";

const USER_AGENT = "Mozilla/5.0 (compatible; EarnLoopImportBot/1.0; +https://earnloop.app)";
const MAX_CANDIDATES = 40;
const FETCH_TIMEOUT_MS = 15000;

export type ImportCandidate = { name: string; source: string; summary: string };
export type FetchResult = { html: string; finalUrl: string };

export class FetchError extends Error {}

export function isFacebookUrl(value: string): boolean {
  try {
    const hostname = new URL(value).hostname;
    return hostname.includes("facebook.com") || hostname.includes("fb.com");
  } catch {
    return false;
  }
}

export const FACEBOOK_NOTE =
  "Facebook blocks anonymous scraping: without a logged-in session the page returns a login wall or empty HTML. Open the page in a browser, copy the full HTML (Ctrl/Cmd+U → select all), and paste it into the 'Paste HTML' tab instead.";

export function suggestedLabelFor(value: string): string {
  try {
    const url = new URL(value);
    if (url.hostname.includes("facebook.com") || url.hostname.includes("fb.com")) {
      const handle = url.pathname.split("/").filter(Boolean)[0];
      return handle ? `Facebook · ${handle}` : "Facebook";
    }
    return url.hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

export function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

export function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

const MEDIA_RE = /\.(png|jpe?g|gif|webp|svg|css|js|ico|woff2?|pdf|zip|xml)(\?.*)?$/i;
const NAV_WORDS = new Set(["home", "login", "log in", "sign up", "sign in", "menu", "search", "privacy", "terms", "contact", "about us", "read more", "click here"]);

function absoluteHref(href: string, baseUrl: string): string | null {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function isArticleHref(href: string, baseUrl: string): boolean {
  const absolute = absoluteHref(href, baseUrl);
  if (!absolute) return false;
  let parsed: URL;
  try {
    parsed = new URL(absolute);
  } catch {
    return false;
  }
  if (!/^https?:$/.test(parsed.protocol)) return false;
  if (MEDIA_RE.test(absolute)) return false;
  if (absolute.includes("#") || absolute.toLowerCase().includes("javascript:")) return false;
  return true;
}

function cleanTitle(value: string): string {
  const text = stripTags(value).replace(/\s+/g, " ").trim();
  return text.slice(0, 150);
}

export function extractCandidates(html: string, baseUrl: string): ImportCandidate[] {
  const entryTitleRe = /<(h[12])[^>]*class="[^"]*\bentry-title\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi;
  const structured = new Map<string, ImportCandidate>();

  let match: RegExpExecArray | null;
  while ((match = entryTitleRe.exec(html)) !== null) {
    const block = match[2];
    const href = /href="([^"]+)"/i.exec(block)?.[1] ?? "";
    if (!isArticleHref(href, baseUrl)) continue;
    const name = cleanTitle(block);
    if (name.length < 8) continue;
    const source = absoluteHref(href, baseUrl) ?? href;
    structured.set(source, { name, source, summary: "" });
    if (structured.size >= MAX_CANDIDATES) break;
  }

  if (structured.size >= 3) return Array.from(structured.values());

  const fallback = new Map<string, ImportCandidate>();
  const anchorRe = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let anchor: RegExpExecArray | null;
  while ((anchor = anchorRe.exec(html)) !== null) {
    const href = anchor[1];
    if (!isArticleHref(href, baseUrl)) continue;
    const text = cleanTitle(anchor[2]);
    if (text.length < 14) continue;
    if (NAV_WORDS.has(text.toLowerCase())) continue;
    const source = absoluteHref(href, baseUrl) ?? href;
    const key = `${source}|${text.toLowerCase()}`;
    if (!fallback.has(key)) {
      fallback.set(key, { name: text, source, summary: "" });
      if (fallback.size >= MAX_CANDIDATES) break;
    }
  }
  return Array.from(fallback.values());
}

export async function fetchHtml(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    let response: Response;
    try {
      response = await fetch(url, {
        cache: "no-store",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
      });
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") {
        throw new FetchError(`The fetch timed out after ${FETCH_TIMEOUT_MS / 1000}s. Try the Paste HTML tab instead.`);
      }
      throw new FetchError("The source could not be reached from the server.");
    }

    if (!response.ok) {
      if (response.status === 403 || response.status === 401 || response.status === 400) {
        throw new FetchError(`The source blocked the request (HTTP ${response.status}). ${FACEBOOK_NOTE}`);
      }
      throw new FetchError(`The source returned HTTP ${response.status}.`);
    }

    const html = await response.text();
    return { html, finalUrl: response.url || url };
  } catch (reason) {
    if (reason instanceof FetchError) throw reason;
    throw new FetchError("The source could not be reached from the server.");
  } finally {
    clearTimeout(timer);
  }
}