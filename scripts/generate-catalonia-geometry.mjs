import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cellToBoundary, cellToLatLng, cellToParent, cellsToMultiPolygon } from "h3-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lines = fs.readFileSync(path.join(root, "data/layer_h3.csv"), "utf8").trim().split(/\r?\n/);
const ids = lines.slice(1).map((line) => line.split(",")[0]);
if (ids.length === 0 || lines[0].split(",")[0] !== "h3") throw new Error("Missing H3 cell IDs");

// Use IDs for geography only. The public preview must never imply these draft model values are approved.
const parents = [...new Set(ids.map((id) => cellToParent(id, 6)))].sort();
const bounds = ids.flatMap((id) => cellToBoundary(id));
const latMin = Math.min(...bounds.map((point) => point[0]));
const latMax = Math.max(...bounds.map((point) => point[0]));
const lonMin = Math.min(...bounds.map((point) => point[1]));
const lonMax = Math.max(...bounds.map((point) => point[1]));
const scale = 650 / (latMax - latMin);
const cosine = Math.cos(((latMin + latMax) / 2) * Math.PI / 180);
const project = ([lat, lon]) => [70 + (lon - lonMin) * cosine * scale, 690 - (lat - latMin) * scale];
const point = (coordinate) => project(coordinate).map((value) => value.toFixed(1)).join(" ");
const ringPath = (ring) => ring.map((coordinate, index) => `${index ? "L" : "M"}${point(coordinate)}`).join(" ") + " Z";
const outlinePath = cellsToMultiPolygon(ids).flatMap((polygon) => polygon.map(ringPath)).join(" ");

const samplePlaces = JSON.parse(fs.readFileSync(path.join(root, "data/sample_places.geojson"), "utf8"));
const places = Object.fromEntries(samplePlaces.features.map((feature) => {
  const ring = feature.geometry.coordinates[0].slice(0, -1);
  const lon = ring.reduce((sum, vertex) => sum + vertex[0], 0) / ring.length;
  const lat = ring.reduce((sum, vertex) => sum + vertex[1], 0) / ring.length;
  const [x, y] = project([lat, lon]);
  const id = feature.properties.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return [id, { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }];
}));
const hotSpot = (x, y, name, width, height, strength) => {
  const place = places[name];
  return strength * Math.exp(-0.5 * (((x - place.x) / width) ** 2 + ((y - place.y) / height) ** 2));
};

const cells = parents.map((id) => {
  const [lat, lon] = cellToLatLng(id);
  const [x, y] = project([lat, lon]);
  const synthetic = 14 + 28 * (y - 40) / 650 + 7 * (x - 70) / 650
    + hotSpot(x, y, "barcelona", 95, 85, 42)
    + hotSpot(x, y, "tarragona", 95, 95, 42)
    + hotSpot(x, y, "girona", 85, 120, 50)
    + 4 * Math.sin(x * 0.045 + y * 0.071);
  return {
    id,
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    path: ringPath(cellToBoundary(id)),
    base: Math.max(10, Math.min(95, Math.round(synthetic))),
  };
});

const geometry = {
  source: "draft H3 cell IDs only; synthetic color bases",
  resolution: 6,
  viewBox: "0 0 790 730",
  outlinePath,
  cells,
  places,
};
fs.writeFileSync(path.join(root, "src/data/cataloniaGeometry.json"), JSON.stringify(geometry) + "\n");
console.log(`Generated ${cells.length} H3 preview cells from ${ids.length} IDs.`);
