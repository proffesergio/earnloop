import { z } from "zod";

export const editorialSectionSchema = z.object({
  heading: z.string().trim().min(1).max(160),
  paragraphs: z.array(z.string().trim().min(1).max(5000)).min(1).max(12),
});

export const editorialContentSchema = z.object({
  schemaVersion: z.literal("1.0.0").default("1.0.0"),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(5).max(180),
  dek: z.string().trim().min(20).max(500),
  category: z.string().trim().min(2).max(60),
  readTime: z.string().trim().min(3).max(40),
  author: z.string().trim().min(2).max(100),
  contentType: z.enum(["guide", "news"]).default("news"),
  takeaways: z.array(z.string().trim().min(5).max(300)).min(1).max(8),
  sections: z.array(editorialSectionSchema).min(1).max(12),
  seo: z.object({
    title: z.string().trim().max(180).optional(),
    description: z.string().trim().max(320).optional(),
  }).default({}),
});

export const editorialInputSchema = editorialContentSchema.omit({ schemaVersion: true });
export type EditorialContent = z.infer<typeof editorialContentSchema>;
export type EditorialInput = z.infer<typeof editorialInputSchema>;

export const editorialMutationSchema = z.object({
  content: editorialInputSchema,
  status: z.enum(["draft", "review", "published"]).default("draft"),
  featured: z.boolean().default(false),
});

export function editorialToPayload(content: EditorialInput) {
  return editorialContentSchema.parse({ ...content, schemaVersion: "1.0.0" });
}
