import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateJson, isProviderConfigured, resolveProvider, type AiProviderName } from "@/lib/ai/providers";
import { sideHustleSchema } from "@/lib/hustle-contract";

type HustleInput = {
  topic: string;
  category?: "content" | "commerce" | "freelance" | "local" | "apps";
  difficulty?: "easy" | "medium" | "hard";
  capitalBand?: "0" | "1-50" | "50-200" | "200-plus";
  provider?: AiProviderName;
};

const inputGuard: (value: unknown) => value is HustleInput = (value): value is HustleInput => {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<HustleInput>;
  return typeof input.topic === "string" && input.topic.trim().length >= 3 && input.topic.length <= 240;
};

const systemPrompt = [
  "You are the hustle blueprint writer for EarnLoop. Return ONLY valid JSON matching this exact shape:",
  "{schemaVersion:\"1.0.0\",slug,title,summary,category,difficulty,setupHoursBand,capitalBand,aiTools,tags,heroMetric,overview,audience:{for,notFor},blueprint:[{order,title,body,effortMinutes,isFreePreview}],prompts:[{title,prompt,tool,gated}],monetization:{model,steps,affiliateNotes},metrics:{leading,lagging},xpCompletion,seo:{title,description}}",
  "Rules: slug must be `^[a-z0-9]+(?:-[a-z0-9]+)*$`. setupHoursBand is one of 0-2, 2-8, 8-plus. capitalBand is one of 0, 1-50, 50-200, 200-plus. aiTools are from chatgpt, gemini, claude, midjourney, canva, capcut, notion, other. blueprint must have at least 3 steps and the first step must have isFreePreview=true. prompts must have at least 1 and at most 2 gated:true entries. overview must be at least 80 characters. effortMinutes are integers >= 5. xpCompletion is an integer between 10 and 200.",
  "Brand voice: honest, specific, effort-first. Never promise income or 'overnight $10k'. Prefer 'first $1 proof', 'hours to first listing', 'tools you already have'. Give a heroMetric like 'First listing in one focused afternoon'. Keep monetization concrete and stepwise.",
  "All content must be educational and safe: no medical/financial/legal advice as certainty, no gambling or MLM framing, no income guarantees.",
].join("\n");

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const body: unknown = await request.json().catch(() => null);
  if (!inputGuard(body)) return NextResponse.json({ error: "Provide a topic with 3–240 characters." }, { status: 400 });

  const input = body as HustleInput;
  const provider = resolveProvider(input.provider);
  if (!isProviderConfigured(provider)) {
    return NextResponse.json(
      { error: provider === "gemini" ? "Gemini is not configured. Add GEMINI_API_KEY or switch to openai." : "OpenAI is not configured. Add OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const userPrompt = [
    `Create a realistic, ready-to-review hustle blueprint. Topic: ${input.topic}.`,
    `Preferences: category=${input.category ?? "any reasonable"}, difficulty=${input.difficulty ?? "reasonable"}, maximum starting capital=${input.capitalBand ?? "0"} where the hustle stays honest at that budget.`,
    `Audience: English-speaking solo operators, mobile-first, South Asia + global remote workers. Keep effort and revenue language honest.`,
  ].join("\n");

  let generated: unknown;
  try {
    generated = await generateJson(systemPrompt, userPrompt, provider);
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed.";
    await createSupabaseAdminClient().from("ai_jobs").insert({ actor: session.user.id, kind: "hustle", model: provider, ok: false, error: message });
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const parsed = sideHustleSchema.safeParse(generated);
  if (!parsed.success) {
    const issues = parsed.error.flatten();
    await createSupabaseAdminClient().from("ai_jobs").insert({ actor: session.user.id, kind: "hustle", model: provider, ok: false, error: "AI returned an invalid hustle blueprint." });
    return NextResponse.json({ error: "AI returned an invalid hustle blueprint.", issues }, { status: 502 });
  }

  const content = parsed.data;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("hustles")
    .insert({
      slug: content.slug,
      content_type: "hustle",
      status: "draft",
      title: content.title,
      summary: content.summary,
      payload: content,
      created_by: session.user.id,
    })
    .select("id")
    .single();

  await supabase.from("ai_jobs").insert({ actor: session.user.id, kind: "hustle", model: provider, ok: !error, error: error?.message ?? null });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.code === "23505" ? "The generated slug already exists. Edit and save the draft manually." : "Could not persist the generated draft." },
      { status: 502 }
    );
  }

  await supabase.from("admin_audit").insert({ actor: session.user.id, action: "generate", entity: "hustle", entity_id: data.id });
  return NextResponse.json({ id: data.id, content, status: "draft" }, { status: 201 });
}