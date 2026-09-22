import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cellToParent, getResolution, isValidCell } from "h3-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readRows = (name) => fs.readFileSync(path.join(root, name), "utf8").trim().split(/\r?\n/);

const h3Rows = readRows("data/layer_h3.csv");
const header = h3Rows.shift().split(",");
const expected = ["h3", ...Array.from({ length: 12 }, (_, index) => `m${String(index + 1).padStart(2, "0")}`), "confidence"];
if (header.join() !== expected.join()) throw new Error("Unexpected H3 CSV columns");

const layerRows = readRows("data/layers.csv").map((row) => row.split(","));
const layerValues = layerRows.find((row) => row[0] === "albopictus_h3");
if (!layerValues) throw new Error("Missing albopictus_h3 metadata");
const layer = Object.fromEntries(layerRows[0].map((key, index) => [key, layerValues[index]]));
const classBreaks = layer.class_breaks.split(";").map(Number);
if (classBreaks.length !== 4 || classBreaks.some((value, index) => !Number.isFinite(value) || (index > 0 && value <= classBreaks[index - 1]))) {
  throw new Error("Invalid model class breaks");
}

const groups = new Map();
const seen = new Set();
let fractionalValues = 0;
for (const line of h3Rows) {
  const parts = line.split(",");
  const id = parts[0];
  if (parts.length !== 14 || !isValidCell(id) || getResolution(id) !== 7 || seen.has(id)) {
    throw new Error(`Invalid or duplicate H3 cell: ${id}`);
  }
  seen.add(id);

  const rawValues = parts.slice(1, 13);
  if (rawValues.some((value) => value === "")) throw new Error(`Missing probability: ${id}`);
  const values = rawValues.map(Number);
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
    throw new Error(`Invalid probability: ${id}`);
  }
  fractionalValues += values.filter((value) => !Number.isInteger(value)).length;

  const confidence = parts[13];
  if (!["low", "medium", "high"].includes(confidence)) throw new Error(`Invalid confidence: ${id}`);
  const parent = cellToParent(id, 6);
  const group = groups.get(parent) ?? { sums: Array(12).fill(0), count: 0, confidence: { low: 0, medium: 0, high: 0 } };
  values.forEach((value, index) => { group.sums[index] += value; });
  group.count++;
  group.confidence[confidence]++;
  groups.set(parent, group);
}

// The older placeholder happened to use the same H3 IDs but only whole-number scores.
if (fractionalValues === 0) {
  throw new Error("All H3 values are integers; this appears to be the old synthetic placeholder, not the supplied draft model update.");
}
const geometry = JSON.parse(fs.readFileSync(path.join(root, "src/data/cataloniaGeometry.json"), "utf8"));
const geometryIds = new Set(geometry.cells.map((cell) => cell.id));
if (geometryIds.size !== groups.size || [...groups.keys()].some((id) => !geometryIds.has(id))) {
  throw new Error("H3 geometry does not match the draft data. Run generate:map-geometry first.");
}

const cells = Object.fromEntries([...groups].map(([id, group]) => [id, {
  months: group.sums.map((sum) => Number((sum / group.count).toPrecision(6))),
  count: group.count,
  confidence: group.confidence,
}]));
const output = {
  source: "data/layer_h3.csv",
  method: "Arithmetic mean of draft resolution-7 H3 estimates within each displayed resolution-6 H3 cell; not an official geographic boundary or a population-weighted estimate.",
  period: layer.period,
  units: { ca: layer.unit_ca, es: layer.unit_es, en: layer.unit_en },
  classBreaks,
  sourceCellCount: seen.size,
  displayCellCount: groups.size,
  cells,
};
fs.writeFileSync(path.join(root, "src/data/cataloniaDraft.json"), `${JSON.stringify(output)}\n`);
console.log(`Validated ${seen.size} draft H3 rows and aggregated to ${groups.size} displayed cells.`);
