import type { HomeLocale } from "./home";
import raw from "../../data/outputs.csv?raw";
import { z } from "zod";
import { parseResearchCsv, requireUniqueIds } from "./parseResearchCsv";

export type OutputKind = "dataset" | "code" | "other";

export interface ResearchOutput {
  id: string;
  kind: OutputKind;
  title: Record<HomeLocale, string>;
  description: Record<HomeLocale, string>;
  host: string;
  url: string;
  year?: number;
  license?: string;
  doi?: string;
}

const httpsUrl = z.string().refine((value) => {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "must be an HTTPS URL");
const outputRow = z.strictObject({
  id: z.string().min(1),
  type: z.enum(["dataset", "code", "other"]),
  title: z.string().min(1),
  description_ca: z.string(),
  description_es: z.string(),
  description_en: z.string().min(1),
  repository: z.string().min(1),
  doi: z.string().refine((value) => !value || /^10\.\d{4,9}\/\S+$/.test(value), "must be a DOI or blank"),
  url: httpsUrl,
  year: z.string().regex(/^\d{4}$/),
  licence: z.string(),
});

const rows = parseResearchCsv("data/outputs.csv", raw, outputRow);
requireUniqueIds("data/outputs.csv", rows);

// Titles are supplied in one language; descriptions are localized in the handover CSV.
export const researchOutputs: ResearchOutput[] = rows.map((row) => ({
  id: row.id,
  kind: row.type,
  title: { ca: row.title, es: row.title, en: row.title },
  description: { ca: row.description_ca || row.description_en, es: row.description_es || row.description_en, en: row.description_en },
  host: row.repository === "zenodo" ? "Zenodo" : row.repository === "github" ? "GitHub" : row.repository,
  url: row.url,
  year: Number(row.year),
  license: row.licence || undefined,
  doi: row.doi || undefined,
}));
