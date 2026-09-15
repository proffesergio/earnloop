import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import {
  extractCandidates,
  fetchHtml,
  isFacebookUrl,
  suggestedLabelFor,
  FACEBOOK_NOTE,
  FetchError,
} from "@/lib/importer/extract";

const bodySchema = z.object({
  url: z.string().trim().url().max(500).optional(),
  html: z.string().trim().max(200000).optional(),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (!parsed.data.url && !parsed.data.html)) {
    return NextResponse.json({ error: "Provide a URL or pasted HTML." }, { status: 400 });
  }

  const { url, html } = parsed.data;
  const anchorUrl = url ?? "https://import.local";

  if (html) {
    const candidates = extractCandidates(html, anchorUrl);
    return NextResponse.json({ candidates, suggestedLabel: suggestedLabelFor(anchorUrl) });
  }

  if (!url) {
    return NextResponse.json({ error: "Provide a URL or pasted HTML." }, { status: 400 });
  }

  let result;
  try {
    result = await fetchHtml(url);
  } catch (reason) {
    const note = reason instanceof FetchError ? reason.message : "The source could not be reached from the server.";
    return NextResponse.json({ candidates: [], note, facebook: isFacebookUrl(url) });
  }

  const candidates = extractCandidates(result.html, result.finalUrl);
  const note = isFacebookUrl(url) ? FACEBOOK_NOTE : null;
  return NextResponse.json({ candidates, note, suggestedLabel: suggestedLabelFor(result.finalUrl), facebook: isFacebookUrl(url) });
}