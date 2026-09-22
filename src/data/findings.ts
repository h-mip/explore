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
if (rows.length !== expected.length || expected.some((id) => !rows.some((row) => row.id === id))) {
  throw new Error("findings.csv: expected exactly f1, f2, f3 and f4");
}
for (const row of rows) {
  if (!Number.isFinite(Number(row.value)) || Number(row.value) < 0 || Number(row.value) > 100 || row.unit !== "%") {
    throw new Error(`findings.csv: ${row.id} needs a percentage value from 0 to 100`);
  }
  if (row.link_page !== (row.id === "f1" || row.id === "f2" ? "when" : "activities")) {
    throw new Error(`findings.csv: ${row.id} has an unexpected link_page`);
  }
}

export function finding(id: string, locale: HomeLocale) {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error(`findings.csv: missing ${id}`);
  return { id, value: Number(row.value), unit: row.unit, text: row[`text_${locale}`], linkPage: row.link_page };
}
