import Papa from "papaparse";
import type { ZodType } from "zod";

// Parse at build time so editors get a filename and row number when a handover CSV changes shape.
export function parseResearchCsv<T>(name: string, raw: string, schema: ZodType<T>): T[] {
  const parsed = Papa.parse<Record<string, string>>(raw, { header: true, skipEmptyLines: "greedy" });
  if (parsed.errors.length) {
    const error = parsed.errors[0];
    throw new Error(`${name}, row ${error.row + 2}: ${error.message}`);
  }
  if (!parsed.data.length) throw new Error(`${name}: no records found`);
  return parsed.data.map((row, index) => {
    const result = schema.safeParse(row);
    if (!result.success) {
      const detail = result.error.issues.map((issue) => `${issue.path.join(".") || "record"}: ${issue.message}`).join("; ");
      throw new Error(`${name}, row ${index + 2}: ${detail}`);
    }
    return result.data;
  });
}

export function requireUniqueIds(name: string, records: { id: string }[]): void {
  const seen = new Set<string>();
  for (const record of records) {
    if (seen.has(record.id)) throw new Error(`${name}: duplicate id ${record.id}`);
    seen.add(record.id);
  }
}
