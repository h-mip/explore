# Maintaining H-MIP research data

This directory is the single source of truth for editable H-MIP research data. Do not create or update copies under `public/`.

## John's update workflow

1. Open the repository's `data/` directory on GitHub.
2. Edit a small CSV in place, or choose **Add file → Upload files** to replace a larger CSV with a file that has the same name.
3. Keep the existing header row, column names, delimiter, and filename. Save CSVs as UTF-8, comma-separated files.
4. Commit the update (or open a pull request if branch protection requires one).
5. Check the **Validate data and build** GitHub check. It runs `npm run build`, which validates the map CSVs, regenerates the MapLibre datasets and real-data Home teaser, and builds the site. The connected hosting service must also run `npm run build` for deployment.

John can replace the CSV files in this directory, provided their existing column names and formats are retained. The GeoJSON files in `data/icgc/` are developer-maintained source geometry. Everything in `public/generated/` is recreated by the build and must not be edited or uploaded manually.

If a build fails after an upload, open the failed check to find the filename, row, and validation message. Correct the canonical CSV in `data/` and commit again.

## File guide

| File | Current site use |
| --- | --- |
| `layer_h3.csv` | Monthly draft H3 estimates and confidence. Builds the exact H3 GeoJSON used by the MapLibre map and the static Home teaser; both use original resolution-7 cells. |
| `layer_municipality.csv` | Monthly draft estimates and confidence joined to 947 ICGC municipality polygons by six-digit code. Drives the municipality map layer, search, selection, and table. |
| `layers.csv` | Map units in Catalan, Spanish, and English; class breaks; period; and H3 resolution. Used by map generation and the MapLibre legend. |
| `outputs.csv` | Public datasets, code, and other project outputs shown on Data & Code. |
| `publications.csv` | Publication records shown on About. |
| `temporal.csv` | Supplied draft/reference hourly, monthly and indoor/outdoor shares. Drives the When charts and Home time previews; lower and upper bounds are displayed without assuming an interval method. |
| `activities_places.csv` | Supplied draft/reference activity and place shares for all year, June–September and the rest of the year. Drives the Activities charts and Home previews. Its all-year activity `rate` values are shown as source values only; their definition and unit need confirmation. |
| `findings.csv` | Supplied localized draft/reference headline findings on Home. Their scientific wording needs client review before launch. |
| `taxonomy.csv` | Supplied draft/reference localized activity and place labels and descriptions used by the Activities page and Home previews. |
| `icgc/municipalities.geojson` | Developer-maintained ICGC municipality source boundaries. |
| `icgc/comarques.geojson` | Developer-maintained ICGC comarca source boundaries. |

## Generated map files

The map generator reads only these canonical inputs:

- `data/layer_h3.csv`
- `data/layer_municipality.csv`
- `data/layers.csv`
- `data/icgc/municipalities.geojson`
- `data/icgc/comarques.geojson`

It writes `h3.geojson`, `municipalities.geojson`, `comarques.geojson`, `map-meta.json`, and `home-h3-preview.svg` to `public/generated/`. The SVG is a static rendering of the original August H3 values for Home; it does not aggregate cells. These generated files are ignored by Git; `.gitkeep` keeps the directory itself in the repository.

The old synthetic SVG map generators and sample geometry have been removed. The three draft CSV download URLs are emitted directly from `/data` by `src/pages/data/[file].csv.ts`; that route is separate from the translated Data & Code pages.

For a local check, run:

```sh
npm run build
```
