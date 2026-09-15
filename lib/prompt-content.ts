import "server-only";

import { prompts, type Prompt } from "@/lib/prompts";
import { promptLibrarySchema, type StoredPrompt } from "@/lib/prompt-contract";
import { getSiteSetting } from "@/lib/site-settings";

const LIBRARY_KEY = "prompt_library";

export async function getStoredPromptAdditions(): Promise<StoredPrompt[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return [];
  }

  const saved = await getSiteSetting<unknown>(LIBRARY_KEY);
  if (!saved) return [];
  const parsed = promptLibrarySchema.safeParse(saved);
  return parsed.success ? parsed.data.additions : [];
}

export async function getPromptLibrary(): Promise<Prompt[]> {
  const additions = await getStoredPromptAdditions();
  const merged = new Map<string, Prompt>();
  for (const item of prompts) {
    merged.set(item.title, item);
  }
  for (const item of additions) {
    if (!item.active) continue;
    merged.set(item.title, {
      title: item.title,
      category: item.category,
      tool: item.tool,
      summary: item.summary,
      prompt: item.prompt,
    });
  }
  return Array.from(merged.values());
}

export function isStoredPromptLibrary(value: unknown): boolean {
  return promptLibrarySchema.safeParse(value).success;
}