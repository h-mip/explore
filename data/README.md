# Maintaining H-MIP research data

This directory is the single source of truth for editable H-MIP research data. Do not create or update copies under `public/`.

## John's update workflow

1. Open the repository's `data/` directory on GitHub.
2. Edit a small CSV in place, or choose **Add file → Upload files** to replace a larger CSV with a file that has the same name.
3. Keep the existing header row, column names, delimiter, and filename. Save CSVs as UTF-8, comma-separated files.
4. Commit the update (or open a pull request if branch protection requires one).
5. Check the **Validate data and build** GitHub check. It runs `npm run build`, which validates the map CSVs, regenerates the map files and current SVG preview, and builds the site. The connected hosting service must also run `npm run build` for deployment.

John can replace the CSV files in this directory, provided their existing column names and formats are retained. The GeoJSON files in `data/icgc/` are developer-maintained source geometry. Everything in `public/generated/` is recreated by the build and must not be edited or uploaded manually.

If a build fails after an upload, open the failed check to find the filename, row, and validation message. Correct the canonical CSV in `data/` and commit again.

## File guide

| File | Current site use |
| --- | --- |
| `layer_h3.csv` | Monthly draft H3 estimates and confidence. Builds the exact H3 GeoJSON and the current aggregated SVG preview. |
| `layer_municipality.csv` | Monthly draft estimates and confidence joined to 947 ICGC municipality polygons by six-digit code. The future MapLibre view will use the result. |
| `layers.csv` | Map units in Catalan, Spanish, and English; class breaks; period; and H3 resolution. Used by map generation and the current SVG preview. |
| `outputs.csv` | Public datasets, code, and other project outputs shown on Data & Code. |
| `publications.csv` | Publication records shown on About. |
| `temporal.csv` | Supplied synthetic hourly and monthly values. The current When page still uses labeled demo values in code; replacing this CSV alone does not change that page yet. |
| `activities_places.csv` | Supplied synthetic activity and place values. The current Activities page still uses labeled demo values in code. |
| `findings.csv` | Supplied localized synthetic headline findings. The current Home page still uses labeled demo copy in code. |
| `taxonomy.csv` | Supplied localized activity and place labels. The current Activities page still uses demo labels in code. |
| `sample_places.geojson` | Developer-maintained sample geometry for the temporary SVG preview. |
| `icgc/municipalities.geojson` | Developer-maintained ICGC municipality source boundaries. |
| `icgc/comarques.geojson` | Developer-maintained ICGC comarca source boundaries. |

## Generated map files

The map generator reads only these canonical inputs:

- `data/layer_h3.csv`
- `data/layer_municipality.csv`
- `data/layers.csv`
- `data/icgc/municipalities.geojson`
- `data/icgc/comarques.geojson`

It writes `h3.geojson`, `municipalities.geojson`, `comarques.geojson`, and `map-meta.json` to `public/generated/`. These generated files are ignored by Git; `.gitkeep` keeps the directory itself in the repository.

The two older generators, `scripts/generate-catalonia-geometry.mjs` and `scripts/generate-draft-map.mjs`, remain in the build only because the Phase 1 SVG map still imports their generated JSON from `src/data/`. They derive that preview from the same canonical H3 CSV and are not authoritative geometry for the future MapLibre map. Their JSON outputs are also ignored by Git. The three draft CSV download URLs are emitted directly from `/data` by `src/pages/data/[file].csv.ts`; that route is separate from the translated Data & Code pages.

For a local check, run:

```sh
npm run build
```
