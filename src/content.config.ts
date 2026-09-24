import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const stories = defineCollection({
  loader: glob({ base: "./src/content/stories", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    author: z.string().min(1),
    image: z.string().min(1).optional(),
    image_alt: z.string().optional(),
    locale: z.enum(["ca", "es", "en"]),
    summary: z.string().optional(),
    draft: z.boolean().default(true),
  }),
});

const policies = defineCollection({
  loader: glob({ base: "./src/content/policies", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1),
    last_updated: z.coerce.date(),
  }),
});

const mapMethods = defineCollection({
  loader: glob({ base: "./src/content/map-method", pattern: "*.md" }),
  schema: z.object({}),
});

export const collections = { stories, policies, mapMethods };
