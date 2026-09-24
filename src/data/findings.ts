import raw from "../../data/findings.csv?raw";
import { z } from "zod";
import { parseResearchCsv, requireUniqueIds } from "./parseResearchCsv";
import type { HomeLocale } from "./home";

const schema = z.object({
  id: z.string().min(1), value: z.string(), unit: z.string(),
  text_ca: z.string().min(1), text_es: z.string().min(1), text_en: z.string().min(1),
  link_page: z.string(),
});

const rows = parseResearchCsv("findings.csv", raw, schema);
requireUniqueIds("findings.csv", rows);
const expected = ["f1", "f2", "f3", "f4"];
if (expected.some((id) => !rows.some((row) => row.id === id))) {
  throw new Error("findings.csv: the four Home finding IDs f1–f4 are required; additional rows are allowed");
}
for (const row of rows) {
  if (!Number.isFinite(Number(row.value)) || Number(row.value) < 0 || Number(row.value) > 100 || row.unit !== "%") {
    throw new Error(`findings.csv: ${row.id} needs a percentage value from 0 to 100`);
  }
  if (!["when", "activities", "map", "data", "about"].includes(row.link_page)) {
    throw new Error(`findings.csv: ${row.id} has an unexpected link_page`);
  }
}

export function finding(id: string, locale: HomeLocale) {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`findings.csv: missing ${id}`);
  return { id, value: Number(row.value), unit: row.unit, text: row[`text_${locale}`], linkPage: row.link_page };
}
