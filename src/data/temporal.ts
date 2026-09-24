import raw from "../../data/temporal.csv?raw";
import { z } from "zod";
import { parseResearchCsv } from "./parseResearchCsv";

const rawRow = z.object({
  dimension: z.string(),
  category: z.string(),
  share: z.string(),
  lower: z.string(),
  upper: z.string(),
  n: z.string(),
});

type TemporalPoint = {
  category: string;
  share: number;
  lower: number | null;
  upper: number | null;
  n: number;
};

function proportion(value: string, context: string, optional = false): number | null {
  if (optional && value.trim() === "") return null;
  const number = Number(value);
  if (!value.trim() || !Number.isFinite(number) || number < 0 || number > 1) {
    throw new Error(`${context}: expected a proportion between 0 and 1`);
  }
  return number;
}

const rows = parseResearchCsv("temporal.csv", raw, rawRow).map((row, index) => {
  const context = `temporal.csv row ${index + 2}`;
  const share = proportion(row.share, `${context}.share`)!;
  const lower = proportion(row.lower, `${context}.lower`, true);
  const upper = proportion(row.upper, `${context}.upper`, true);
  const n = Number(row.n);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`${context}.n: expected a positive integer`);
  if ((lower === null) !== (upper === null) ||
      (lower !== null && upper !== null && (lower > share || upper < share))) {
    throw new Error(`${context}: lower/upper bounds must bracket share, or both be blank`);
  }
  return { dimension: row.dimension, category: row.category, share, lower, upper, n };
});

function ordered(dimension: string, categories: string[]): TemporalPoint[] {
  const matching = rows.filter((row) => row.dimension === dimension);
  const byCategory = new Map(matching.map((row) => [row.category, row]));
  if (matching.length !== categories.length || byCategory.size !== categories.length ||
      categories.some((category) => !byCategory.has(category))) {
    throw new Error(`temporal.csv: ${dimension} must contain exactly ${categories.join(", ")}`);
  }
  const total = matching.reduce((sum, row) => sum + row.share, 0);
  if (Math.abs(total - 1) > 0.005) {
    throw new Error(`temporal.csv: ${dimension} shares must sum to approximately 1; found ${total}`);
  }
  if (dimension !== "setting" && matching.some((row) => row.lower === null || row.upper === null)) {
    throw new Error(`temporal.csv: ${dimension} rows must include lower and upper bounds`);
  }
  return categories.map((category) => byCategory.get(category)!);
}

if (rows.some((row) => !["hour", "month", "setting"].includes(row.dimension))) {
  throw new Error("temporal.csv: unsupported dimension");
}

export const hourlyPattern = ordered("hour", Array.from({ length: 24 }, (_, index) => String(index)));
export const monthlyPattern = ordered("month", Array.from({ length: 12 }, (_, index) => String(index + 1)));
export const settingPattern = ordered("setting", ["outdoor", "indoor"]);
export const temporalSampleSize = hourlyPattern[0].n;
