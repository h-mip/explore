import raw from "../../data/publications.csv?raw";
import { z } from "zod";
import { parseResearchCsv, requireUniqueIds } from "./parseResearchCsv";

export interface Publication {
  id: string;
  type: "article" | "preprint";
  year: number;
  authors: string;
  title: string;
  venue: string;
  doi?: string;
  url?: string;
  openAccessUrl?: string;
}

const httpsUrl = z.string().refine((value) => {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "must be an HTTPS URL");
const publicationRow = z.strictObject({
  id: z.string().min(1),
  type: z.enum(["article", "preprint"]),
  year: z.string().regex(/^\d{4}$/),
  authors: z.string().min(1),
  title: z.string().min(1),
  venue: z.string().min(1),
  doi: z.string().refine((value) => !value || /^10\.\d{4,9}\/\S+$/.test(value), "must be a DOI or blank"),
  url: z.string().refine((value) => !value || httpsUrl.safeParse(value).success, "must be an HTTPS URL or blank"),
  open_access_url: z.string().refine((value) => !value || httpsUrl.safeParse(value).success, "must be an HTTPS URL or blank"),
});

const rows = parseResearchCsv("data/publications.csv", raw, publicationRow);
requireUniqueIds("data/publications.csv", rows);

export const publications: Publication[] = rows.map((row) => ({
  id: row.id,
  type: row.type,
  year: Number(row.year),
  authors: row.authors,
  title: row.title,
  venue: row.venue,
  doi: row.doi || undefined,
  url: row.url || undefined,
  openAccessUrl: row.open_access_url || undefined,
})).sort((a, b) => b.year - a.year);
