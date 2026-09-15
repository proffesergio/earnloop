export type AiProviderName = "openai" | "gemini";

type GenerateJsonOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  retries?: number;
};

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";

function defaultOpenAiModel() {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

function defaultGeminiModel() {
  return process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
}

export function resolveProvider(preferred?: AiProviderName): AiProviderName {
  if (preferred === "gemini" || preferred === "openai") return preferred;
  const configured = process.env.AI_DEFAULT_PROVIDER;
  if (configured === "gemini" || configured === "openai") return configured;
  return "openai";
}

export function isProviderConfigured(provider: AiProviderName): boolean {
  if (provider === "gemini") return Boolean(process.env.GEMINI_API_KEY);
  return Boolean(process.env.OPENAI_API_KEY);
}

async function generateWithOpenAi(system: string, user: string, options: GenerateJsonOptions): Promise<unknown> {
  if (!process.env.OPENAI_API_KEY) throw new Error("AI generation is not configured (OPENAI_API_KEY missing).");
  const model = options.model ?? defaultOpenAiModel();
  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxTokens ?? 2400,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!response.ok) throw new Error("AI provider rejected the request.");
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned an empty response.");
  return JSON.parse(content);
}

async function generateWithGemini(system: string, user: string, options: GenerateJsonOptions): Promise<unknown> {
  if (!process.env.GEMINI_API_KEY) throw new Error("AI generation is not configured (GEMINI_API_KEY missing).");
  const model = options.model ?? defaultGeminiModel();
  const endpoint = GEMINI_ENDPOINT.replace("{model}", model);
  const response = await fetch(`${endpoint}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: `${system}\n\n${user}` }] },
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.4,
        maxOutputTokens: options.maxTokens ?? 2400,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!response.ok) throw new Error("AI provider rejected the request.");
  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("AI returned an empty response.");
  return JSON.parse(text.replace(/^```json\s*/, "").replace(/\s*```$/, ""));
}

/** Requests strict JSON from either provider. `system` may embed a JSON shape instruction. */
export async function generateJson(
  system: string,
  user: string,
  provider: AiProviderName,
  options: GenerateJsonOptions = {}
): Promise<unknown> {
  const attempts = Math.max(1, options.retries ?? 2);
  let lastError: unknown = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      if (provider === "gemini") return await generateWithGemini(system, user, options);
      return await generateWithOpenAi(system, user, options);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
    }
  }
  if (lastError instanceof Error) throw lastError;
  throw new Error("AI generation failed.");
}