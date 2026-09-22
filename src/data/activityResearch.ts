import activityCsv from "../../data/activities_places.csv?raw";
import taxonomyCsv from "../../data/taxonomy.csv?raw";
import { z } from "zod";
import { parseResearchCsv } from "./parseResearchCsv";
import type { HomeLocale } from "./home";

export type ActivityKind = "activity" | "place_type";
export type Season = "all" | "summer" | "rest";

const activitySchema = z.object({
  kind: z.string(), code: z.string(), season: z.string(), share: z.string(),
  lower: z.string(), upper: z.string(), rate: z.string(), n: z.string(),
});
const taxonomySchema = z.object({
  kind: z.string(), code: z.string(), label_ca: z.string(), label_es: z.string(), label_en: z.string(),
  description_ca: z.string(), description_es: z.string(), description_en: z.string(),
});

function fraction(raw: string, context: string): number {
  const value = Number(raw);
  if (!raw.trim() || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${context}: expected a fraction from 0 to 1`);
  }
  return value;
}

const taxonomy = parseResearchCsv("taxonomy.csv", taxonomyCsv, taxonomySchema);
const taxonByKey = new Map<string, (typeof taxonomy)[number]>();
for (const row of taxonomy) {
  const key = `${row.kind}:${row.code}`;
  if (taxonByKey.has(key)) throw new Error(`taxonomy.csv: duplicate ${key}`);
  if (!["ca", "es", "en"].every((locale) => row[`label_${locale}` as "label_ca"].trim())) {
    throw new Error(`taxonomy.csv: missing localized label for ${key}`);
  }
  taxonByKey.set(key, row);
}

const rows = parseResearchCsv("activities_places.csv", activityCsv, activitySchema).map((row, index) => {
  const context = `activities_places.csv row ${index + 2}`;
  if (!["activity", "place_type"].includes(row.kind) || !["all", "summer", "rest"].includes(row.season)) {
    throw new Error(`${context}: invalid kind or season`);
  }
  const share = fraction(row.share, `${context}.share`);
  const lower = fraction(row.lower, `${context}.lower`);
  const upper = fraction(row.upper, `${context}.upper`);
  if (lower > share || upper < share) throw new Error(`${context}: bounds do not bracket share`);
  const n = Number(row.n);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`${context}.n: expected positive integer`);
  const rate = row.rate.trim() === "" ? null : Number(row.rate);
  if (rate !== null && (!Number.isFinite(rate) || rate < 0)) throw new Error(`${context}.rate: expected non-negative number or blank`);
  const taxon = taxonByKey.get(`${row.kind}:${row.code}`);
  if (!taxon) throw new Error(`${context}: missing taxonomy entry for ${row.kind}:${row.code}`);
  return { kind: row.kind as ActivityKind, code: row.code, season: row.season as Season, share, lower, upper, rate, n, taxon };
});

const groups = ["activity", "place_type"] as const;
const seasons = ["all", "summer", "rest"] as const;
const baselineCodes = new Map<ActivityKind, string[]>();
for (const kind of groups) {
  for (const season of seasons) {
    const subset = rows.filter((row) => row.kind === kind && row.season === season);
    const codes = subset.map((row) => row.code);
    if (subset.length !== 9 || new Set(codes).size !== 9) throw new Error(`activities_places.csv: ${kind}/${season} needs nine unique categories`);
    const total = subset.reduce((sum, row) => sum + row.share, 0);
    if (Math.abs(total - 1) > 0.005) throw new Error(`activities_places.csv: ${kind}/${season} shares sum to ${total}, expected 1`);
    if (new Set(subset.map((row) => row.n)).size !== 1) throw new Error(`activities_places.csv: ${kind}/${season} has inconsistent n`);
    if (season === "all") baselineCodes.set(kind, codes);
    else if (codes.some((code) => !baselineCodes.get(kind)!.includes(code))) throw new Error(`activities_places.csv: ${kind}/${season} categories differ from all-year categories`);
  }
}
if (rows.length !== 54) throw new Error(`activities_places.csv: expected 54 rows, found ${rows.length}`);

export function activityRows(kind: ActivityKind, season: Season, locale: HomeLocale) {
  return rows.filter((row) => row.kind === kind && row.season === season)
    .map((row) => ({ code: row.code, label: row.taxon[`label_${locale}`], description: row.taxon[`description_${locale}`],
      share: row.share, lower: row.lower, upper: row.upper, rate: row.rate, n: row.n }))
    .sort((a, b) => b.share - a.share);
}
