import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import {
  cellToBoundary,
  getResolution,
  isValidCell,
} from "h3-js";

const root = process.cwd();

const paths = {
  h3Csv: path.join(root, "data/layer_h3.csv"),
  municipalityCsv: path.join(root, "data/layer_municipality.csv"),
  layersCsv: path.join(root, "data/layers.csv"),
  icgcMunicipalities: path.join(root, "data/icgc/municipalities.geojson"),
  icgcComarques: path.join(root, "data/icgc/comarques.geojson"),
  outputDir: path.join(root, "public/generated"),
};

const MONTH_FIELDS = Array.from(
  { length: 12 },
  (_, index) => `m${String(index + 1).padStart(2, "0")}`,
);

const CONFIDENCE = new Set(["low", "medium", "high"]);
const H3_COLUMNS = ["h3", ...MONTH_FIELDS, "confidence"];
const MUNICIPALITY_COLUMNS = ["municipality_code", ...MONTH_FIELDS, "confidence"];
const LAYER_COLUMNS = [
  "layer_id", "unit_ca", "unit_es", "unit_en", "class_breaks", "period", "h3_resolution",
];
const EXPECTED_MUNICIPALITIES = 947;
const EXPECTED_COMARQUES = 43;

function readText(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required file: ${path.relative(root, file)}`);
  }
  return fs.readFileSync(file, "utf8");
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function parseCsv(file, expectedColumns) {
  const relative = path.relative(root, file);
  const parsed = Papa.parse(readText(file), {
    header: true,
    skipEmptyLines: "greedy",
  });

  if (parsed.errors.length) {
    const error = parsed.errors[0];
    throw new Error(
      `${relative}, row ${(error.row ?? 0) + 2}: ${error.message}`,
    );
  }

  const columns = parsed.meta.fields ?? [];
  if (columns.join("\u0000") !== expectedColumns.join("\u0000")) {
    throw new Error(
      `${relative}: expected columns ${expectedColumns.join(", ")}; found ${columns.join(", ")}`,
    );
  }

  return parsed.data;
}

function parseNumber(value, context) {
  const text = String(value ?? "").trim();
  const number = Number(text);
  if (!text || !Number.isFinite(number)) {
    throw new Error(`${context}: expected numeric value, received "${value}"`);
  }
  return number;
}

function nonEmpty(value, context) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error(`${context}: value is required`);
  return text;
}

function validateConfidence(value, context) {
  const confidence = String(value ?? "").trim().toLowerCase();
  if (!CONFIDENCE.has(confidence)) {
    throw new Error(
      `${context}: invalid confidence "${value}". Expected low, medium, or high.`,
    );
  }
  return confidence;
}

function validateMunicipalityCode(value, context) {
  const code = String(value ?? "").trim();

  if (!/^\d{6}$/.test(code)) {
    throw new Error(
      `${context}: municipality code must contain exactly six digits; received "${value}"`,
    );
  }

  return code;
}

function modelProperties(row, context) {
  const properties = {};

  for (const month of MONTH_FIELDS) {
    const probability = parseNumber(row[month], `${context}.${month}`);
    if (probability < 0 || probability > 100) {
      throw new Error(`${context}.${month}: probability must be between 0 and 100`);
    }
    properties[month] = probability;
  }

  properties.confidence = validateConfidence(
    row.confidence,
    `${context}.confidence`,
  );

  return properties;
}

function ensureClosedRing(coordinates) {
  if (!coordinates.length) return coordinates;

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];

  if (first[0] === last[0] && first[1] === last[1]) {
    return coordinates;
  }

  return [...coordinates, first];
}

function featureCollection(features) {
  return {
    type: "FeatureCollection",
    features,
  };
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value)}\n`, "utf8");
}

function collectCoordinates(value, bounds) {
  if (!Array.isArray(value)) return;

  if (
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    const [lng, lat] = value;
    bounds[0] = Math.min(bounds[0], lng);
    bounds[1] = Math.min(bounds[1], lat);
    bounds[2] = Math.max(bounds[2], lng);
    bounds[3] = Math.max(bounds[3], lat);
    return;
  }

  for (const child of value) {
    collectCoordinates(child, bounds);
  }
}

function boundsFor(features) {
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];

  for (const feature of features) {
    if (feature.geometry?.coordinates) {
      collectCoordinates(feature.geometry.coordinates, bounds);
    }
  }

  if (bounds.some((value) => !Number.isFinite(value))) {
    throw new Error("Could not calculate geographic bounds.");
  }

  return bounds;
}

function validateGeometry(geometry, context) {
  if (!geometry || !["Polygon", "MultiPolygon"].includes(geometry.type)) {
    throw new Error(`${context}: expected Polygon or MultiPolygon geometry`);
  }
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  if (!Array.isArray(polygons) || !polygons.length) {
    throw new Error(`${context}: geometry has no polygons`);
  }
  for (const polygon of polygons) {
    if (!Array.isArray(polygon) || !polygon.length) {
      throw new Error(`${context}: polygon has no rings`);
    }
    for (const ring of polygon) {
      if (!Array.isArray(ring) || ring.length < 4) {
        throw new Error(`${context}: polygon ring has fewer than four positions`);
      }
      for (const position of ring) {
        if (!Array.isArray(position) || position.length < 2 ||
            !Number.isFinite(position[0]) || !Number.isFinite(position[1]) ||
            Math.abs(position[0]) > 180 || Math.abs(position[1]) > 90) {
          throw new Error(`${context}: invalid longitude/latitude position`);
        }
      }
      const first = ring[0];
      const last = ring.at(-1);
      if (first[0] !== last[0] || first[1] !== last[1]) {
        throw new Error(`${context}: polygon ring is not closed`);
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Layer metadata                                                             */
/* -------------------------------------------------------------------------- */

const layerRows = parseCsv(paths.layersCsv, LAYER_COLUMNS);
const seenLayers = new Set();

const layers = Object.fromEntries(
  layerRows.map((row, index) => {
    const context = `layers.csv row ${index + 2}`;
    const id = nonEmpty(row.layer_id, `${context}.layer_id`);
    if (seenLayers.has(id)) throw new Error(`${context}: duplicate layer_id ${id}`);
    seenLayers.add(id);

    const classBreaks = String(row.class_breaks ?? "")
      .split(";")
      .map((value) => parseNumber(value, `${id}.class_breaks`));

    if (classBreaks.length !== 4) {
      throw new Error(
        `${id}: expected exactly four class breaks, found ${classBreaks.length}`,
      );
    }
    if (classBreaks.some((value, index) => value <= 0 || value >= 100 ||
        (index > 0 && value <= classBreaks[index - 1]))) {
      throw new Error(`${context}: class_breaks must be increasing values between 0 and 100`);
    }

    const h3Resolution = row.h3_resolution
      ? parseNumber(row.h3_resolution, `${context}.h3_resolution`)
      : null;
    if (h3Resolution !== null && !Number.isInteger(h3Resolution)) {
      throw new Error(`${context}: h3_resolution must be an integer`);
    }

    return [
      id,
      {
        id,
        units: {
          ca: nonEmpty(row.unit_ca, `${context}.unit_ca`),
          es: nonEmpty(row.unit_es, `${context}.unit_es`),
          en: nonEmpty(row.unit_en, `${context}.unit_en`),
        },
        classBreaks,
        period: nonEmpty(row.period, `${context}.period`),
        h3Resolution,
      },
    ];
  }),
);

const h3Layer = layers.albopictus_h3;
const municipalityLayer = layers.albopictus_municipality;

if (!h3Layer) throw new Error("layers.csv: missing albopictus_h3");
if (!municipalityLayer) {
  throw new Error("layers.csv: missing albopictus_municipality");
}
if (h3Layer.h3Resolution !== 7) {
  throw new Error("layers.csv: albopictus_h3 must declare H3 resolution 7");
}
if (municipalityLayer.h3Resolution !== null) {
  throw new Error("layers.csv: albopictus_municipality must have an empty h3_resolution");
}

/* -------------------------------------------------------------------------- */
/* H3                                                                         */
/* -------------------------------------------------------------------------- */

const h3Rows = parseCsv(paths.h3Csv, H3_COLUMNS);

if (!h3Rows.length) {
  throw new Error("layer_h3.csv contains no rows");
}

const seenH3 = new Set();

const h3Features = h3Rows.map((row, index) => {
  const rowNumber = index + 2;
  const id = String(row.h3 ?? "").trim();

  if (!id) {
    throw new Error(`layer_h3.csv row ${rowNumber}: missing h3 index`);
  }

  if (seenH3.has(id)) {
    throw new Error(`layer_h3.csv row ${rowNumber}: duplicate H3 index ${id}`);
  }
  seenH3.add(id);

  if (!isValidCell(id)) {
    throw new Error(`layer_h3.csv row ${rowNumber}: invalid H3 index ${id}`);
  }

  const resolution = getResolution(id);

  if (resolution !== h3Layer.h3Resolution) {
    throw new Error(
      `layer_h3.csv row ${rowNumber}: ${id} is resolution ${resolution}; expected ${h3Layer.h3Resolution}`,
    );
  }

  // h3-js with geoJson=true returns [longitude, latitude].
  const boundary = ensureClosedRing(cellToBoundary(id, true));

  return {
    type: "Feature",
    id,
    properties: {
      id,
      h3: id,
      ...modelProperties(row, `layer_h3.csv row ${rowNumber}`),
    },
    geometry: {
      type: "Polygon",
      coordinates: [boundary],
    },
  };
});

/* -------------------------------------------------------------------------- */
/* Municipalities                                                             */
/* -------------------------------------------------------------------------- */

const municipalityRows = parseCsv(paths.municipalityCsv, MUNICIPALITY_COLUMNS);
if (municipalityRows.length !== EXPECTED_MUNICIPALITIES) {
  throw new Error(`layer_municipality.csv: expected ${EXPECTED_MUNICIPALITIES} rows; found ${municipalityRows.length}`);
}

const municipalityModel = new Map();

for (const [index, row] of municipalityRows.entries()) {
  const rowNumber = index + 2;
  const code = validateMunicipalityCode(
    row.municipality_code,
    `layer_municipality.csv row ${rowNumber}`,
  );

  if (municipalityModel.has(code)) {
    throw new Error(
      `layer_municipality.csv row ${rowNumber}: duplicate municipality ${code}`,
    );
  }

  municipalityModel.set(code, {
    municipality_code: code,
    ...modelProperties(
      row,
      `layer_municipality.csv row ${rowNumber}`,
    ),
  });
}

const icgcMunicipalities = readJson(paths.icgcMunicipalities);

if (
  icgcMunicipalities.type !== "FeatureCollection" ||
  !Array.isArray(icgcMunicipalities.features)
) {
  throw new Error("ICGC municipalities file is not a FeatureCollection");
}
if (icgcMunicipalities.features.length !== EXPECTED_MUNICIPALITIES) {
  throw new Error(`ICGC municipalities: expected ${EXPECTED_MUNICIPALITIES} features; found ${icgcMunicipalities.features.length}`);
}

const seenMunicipalities = new Set();
const unmatchedIcgc = [];

const municipalityFeatures = icgcMunicipalities.features.map(
  (feature, index) => {
    const source = feature.properties ?? {};
    validateGeometry(feature.geometry, `ICGC municipality feature ${index + 1}`);
    const code = validateMunicipalityCode(
      source.CODIMUNI,
      `ICGC municipality feature ${index + 1}`,
    );

    if (seenMunicipalities.has(code)) {
      throw new Error(`ICGC municipalities: duplicate CODIMUNI ${code}`);
    }

    seenMunicipalities.add(code);

    const model = municipalityModel.get(code);

    if (!model) {
      unmatchedIcgc.push(code);
    }

    return {
      type: "Feature",
      id: code,
      properties: {
        municipality_code: code,
        name: String(source.NOMMUNI ?? ""),
        comarca_code: String(source.CODICOMAR ?? ""),
        comarca: String(source.NOMCOMAR ?? ""),
        province_code: String(source.CODIPROV ?? ""),
        province: String(source.NOMPROV ?? ""),
        ...(model ?? {
          ...Object.fromEntries(MONTH_FIELDS.map((month) => [month, null])),
          confidence: null,
        }),
      },
      geometry: feature.geometry,
    };
  },
);

const modelCodesMissingGeometry = [...municipalityModel.keys()].filter(
  (code) => !seenMunicipalities.has(code),
);

if (modelCodesMissingGeometry.length) {
  throw new Error(
    `Model municipalities without ICGC geometry: ${modelCodesMissingGeometry
      .slice(0, 20)
      .join(", ")}${modelCodesMissingGeometry.length > 20 ? "…" : ""}`,
  );
}

if (unmatchedIcgc.length) {
  throw new Error(
    `ICGC municipalities without model values: ${unmatchedIcgc
      .slice(0, 20)
      .join(", ")}${unmatchedIcgc.length > 20 ? "…" : ""}`,
  );
}

/* -------------------------------------------------------------------------- */
/* Comarques                                                                  */
/* -------------------------------------------------------------------------- */

const icgcComarques = readJson(paths.icgcComarques);

if (
  icgcComarques.type !== "FeatureCollection" ||
  !Array.isArray(icgcComarques.features)
) {
  throw new Error("ICGC comarques file is not a FeatureCollection");
}
if (icgcComarques.features.length !== EXPECTED_COMARQUES) {
  throw new Error(`ICGC comarques: expected ${EXPECTED_COMARQUES} features; found ${icgcComarques.features.length}`);
}

const seenComarques = new Set();
const comarcaFeatures = icgcComarques.features.map((feature, index) => {
  const source = feature.properties ?? {};
  const code = String(source.CODICOMAR ?? "").trim();
  validateGeometry(feature.geometry, `ICGC comarca feature ${index + 1}`);

  if (!/^\d{2}$/.test(code)) {
    throw new Error(
      `ICGC comarca feature ${index + 1}: invalid CODICOMAR "${code}"`,
    );
  }
  if (seenComarques.has(code)) {
    throw new Error(`ICGC comarques: duplicate CODICOMAR ${code}`);
  }
  seenComarques.add(code);

  return {
    type: "Feature",
    id: code,
    properties: {
      comarca_code: code,
      name: String(source.NOMCOMAR ?? ""),
      capital: String(source.CAPCOMAR ?? ""),
    },
    geometry: feature.geometry,
  };
});

/* -------------------------------------------------------------------------- */
/* Output                                                                     */
/* -------------------------------------------------------------------------- */

const h3GeoJson = featureCollection(h3Features);
const municipalityGeoJson = featureCollection(municipalityFeatures);
const comarcaGeoJson = featureCollection(comarcaFeatures);

const cataloniaBounds = boundsFor(municipalityFeatures);

const metadata = {
  schemaVersion: 1,
  months: MONTH_FIELDS,
  defaultMonth: "m08",
  defaultLayer: "albopictus_h3",
  bounds: cataloniaBounds,
  layers: {
    albopictus_h3: {
      ...h3Layer,
      featureCount: h3Features.length,
    },
    albopictus_municipality: {
      ...municipalityLayer,
      featureCount: municipalityFeatures.length,
    },
  },
  boundaries: {
    municipalityCount: municipalityFeatures.length,
    comarcaCount: comarcaFeatures.length,
    source: "Institut Cartogràfic i Geològic de Catalunya (ICGC)",
    scale: "1:250,000",
    license: "CC BY 4.0",
  },
  basemap: {
    source: "OpenStreetMap",
    attribution: "© OpenStreetMap contributors",
  },
};

writeJson(
  path.join(paths.outputDir, "h3.geojson"),
  h3GeoJson,
);

writeJson(
  path.join(paths.outputDir, "municipalities.geojson"),
  municipalityGeoJson,
);

writeJson(
  path.join(paths.outputDir, "comarques.geojson"),
  comarcaGeoJson,
);

writeJson(
  path.join(paths.outputDir, "map-meta.json"),
  metadata,
);

console.log("");
console.log("H-MIP map data generated successfully");
console.log("------------------------------------");
console.log(`H3 cells:       ${h3Features.length}`);
console.log(`Municipalities: ${municipalityFeatures.length}`);
console.log(`Comarques:      ${comarcaFeatures.length}`);
console.log(`H3 resolution:  ${h3Layer.h3Resolution}`);
console.log(`Default month:  August (m08)`);
console.log(`Bounds:         ${cataloniaBounds.join(", ")}`);
console.log(`Class breaks:   ${h3Layer.classBreaks.join(", ")}`);
console.log("");
