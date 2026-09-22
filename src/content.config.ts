import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const stories = defineCollection({
  loader: glob({ base: "./src/content/stories", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    author: z.string().min(1),
    image: z.string().min(1),
    locale: z.enum(["ca", "es", "en"]),
    summary: z.string().optional(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { stories };
