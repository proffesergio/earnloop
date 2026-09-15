import { z } from "zod";

export const promptEntrySchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(2).max(140),
  category: z.string().trim().min(1).max(40),
  tool: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(2).max(300),
  prompt: z.string().trim().min(10).max(4000),
  active: z.boolean(),
});

export const promptLibrarySchema = z.object({
  additions: z.array(promptEntrySchema).max(400).default([]),
});

export type StoredPrompt = z.infer<typeof promptEntrySchema>;
export type PromptLibrary = z.infer<typeof promptLibrarySchema>;