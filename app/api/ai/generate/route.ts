import { NextResponse } from "next/server";

type GenerateInput = { topic?: string; contentType?: "guide" | "opportunity" | "prompt"; audience?: string; tone?: string };
type GeneratedContent = { title: string; summary: string; sections: Array<{ heading: string; body: string }>; safetyNotes: string[] };

function validInput(value: unknown): value is GenerateInput {
  if (!value || typeof value !== "object") return false;
  const input = value as GenerateInput;
  return typeof input.topic === "string" && input.topic.trim().length >= 3 && input.topic.length <= 240;
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
  if (!validInput(body)) return NextResponse.json({ error: "Provide a topic with 3–240 characters." }, { status: 400 });
  const input = body as GenerateInput;
  const system = "You are an editorial assistant. Return only valid JSON with title, summary, sections (array of heading/body), and safetyNotes (array). Never promise income, invent employers, or present immigration/legal advice as certainty. Cite official sources as placeholders when facts need verification.";
  const prompt = `${system}\nCreate a ${input.contentType ?? "guide"} about ${input.topic}. Audience: ${input.audience ?? "global beginners"}. Tone: ${input.tone ?? "clear and practical"}.`;
  if (process.env.OPENAI_API_KEY) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", temperature: 0.4, response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt }] }) });
    if (!response.ok) return NextResponse.json({ error: "AI provider rejected the request." }, { status: 502 });
    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    try { return NextResponse.json({ status: "draft", content: JSON.parse(data.choices?.[0]?.message?.content ?? "") as GeneratedContent }); } catch { return NextResponse.json({ error: "AI returned invalid content." }, { status: 502 }); }
  }
  return NextResponse.json({ error: "AI generation is not configured. Set OPENAI_API_KEY on the server." }, { status: 503 });
}
