import type { CollectionEntry } from "astro:content";
import { siteSettings } from "./siteSettings";

export function isPublishedStory(entry: CollectionEntry<"stories">) {
  return !entry.data.draft && (!entry.data.stagingOnly || siteSettings.isStaging);
}
