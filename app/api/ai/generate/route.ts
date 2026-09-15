import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateJson, isProviderConfigured, resolveProvider, type AiProviderName } from "@/lib/ai/providers";
import { editorialInputSchema, editorialToPayload } from "@/lib/content-contract";

type GenerateInput = {
  topic: string;
  contentType?: "guide" | "news";
  audience?: string;
  tone?: string;
  provider?: AiProviderName;
};

function validInput(value: unknown): value is GenerateInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<GenerateInput>;
  return typeof input.topic === "string" && input.topic.trim().length >= 3 && input.topic.length <= 240;
}

const systemPrompt = `You are an editorial assistant for EarnLoop. Return only valid JSON matching this exact shape: {slug,title,dek,category,contentType,readTime,author,takeaways,sections,seo}. sections is an array of {heading,paragraphs}. Never promise income, invent employers, or present immigration/legal advice as certainty. Write specific, honest, practical advice.`;

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const body: unknown = await request.json().catch(() => null);
  if (!validInput(body)) return NextResponse.json({ error: "Provide a topic with 3–240 characters." }, { status: 400 });

  const input = body as GenerateInput;
  const provider = resolveProvider(input.provider);
  if (!isProviderConfigured(provider)) {
    return NextResponse.json(
      { error: provider === "gemini" ? "Gemini is not configured. Add GEMINI_API_KEY or switch to openai." : "OpenAI is not configured. Add OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  const userPrompt = `Create a ${input.contentType ?? "news"} post about ${input.topic}. Audience: ${input.audience ?? "global beginners"}. Tone: ${input.tone ?? "clear and practical"}. Use author "EarnLoop editorial".`;
  let generated: unknown;
  const model = provider;

  try {
    generated = await generateJson(systemPrompt, userPrompt, provider, { temperature: 0.4, maxTokens: 2600 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed.";
    await createSupabaseAdminClient().from("ai_jobs").insert({ actor: session.user.id, kind: "editorial", model, ok: false, error: message });
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const parsed = editorialInputSchema.safeParse(generated);
  if (!parsed.success) {
    await createSupabaseAdminClient().from("ai_jobs").insert({ actor: session.user.id, kind: "editorial", model, ok: false, error: "AI returned invalid editorial content." });
    return NextResponse.json({ error: "AI returned invalid editorial content.", issues: parsed.error.flatten() }, { status: 502 });
  }

  const content = editorialToPayload(parsed.data);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("hustles").insert({
    slug: content.slug,
    content_type: content.contentType,
    status: "draft",
    title: content.title,
    summary: content.dek,
    payload: content,
    created_by: session.user.id,
  }).select("id").single();
  await supabase.from("ai_jobs").insert({ actor: session.user.id, kind: "editorial", model, ok: !error, error: error?.message ?? null });
  if (error || !data) return NextResponse.json({ error: error?.code === "23505" ? "The generated slug already exists. Edit and save the draft manually." : "Could not persist the generated draft." }, { status: 502 });
  await supabase.from("admin_audit").insert({ actor: session.user.id, action: "generate", entity: "content", entity_id: data.id });
  return NextResponse.json({ id: data.id, content, status: "draft" }, { status: 201 });
}