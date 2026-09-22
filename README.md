# H-MIP Explore / Explora

An Astro site for exploring human–mosquito interaction in Catalonia. Catalan is the default language at `/explore/`; Spanish and English are at `/explore/es/` and `/explore/en/`.

## Run locally

```sh
npm install
npm run dev -- --background
npm run build
```

Use `npm run astro -- dev stop` to stop the background server. The static build is written to `dist/`. The configured production URL is `https://h-mip.com/explore/`.

## Data status

The map now offers a **draft 2025 H3 model layer** as well as a labeled synthetic preview and sample places. The draft layer uses the supplied resolution-7 probabilities and confidence classes. For this SVG preview, each displayed resolution-6 cell shows the arithmetic mean of its source cells; it is not a population-weighted estimate. The legend uses the class breaks in `data/layers.csv`. The edge is an H3 footprint, not an official administrative boundary. Home, When, Activities, and the map's preview and sample places still use synthetic demonstration values. None of these views is public-health advice.

The data update ZIP supplied on 22 September 2026 has been applied to `data/layer_h3.csv`; the municipality and metadata files already matched it. The `data/` directory is the single editable source for research CSVs; see [`data/README.md`](data/README.md) for the update workflow and file descriptions. `npm run build` validates the map inputs, regenerates `public/generated/` and the temporary SVG preview data, and then builds the site. The SVG preview generators remain necessary until the MapLibre renderer replaces that preview; they are not the source of the official map geometry. Scientific wording, method, uncertainty, and attribution need review before launch. The three map CSV downloads on Data & Code are emitted from the canonical files during the Astro build, so they do not require copies under `public/`. No license or citation was supplied for the draft model files.

The handover marks `data/outputs.csv` and `data/publications.csv` as real source lists. Data & Code now displays all seven supplied datasets and code records, and About lists the 14 supplied publications newest first. Both pages read these files at build time and validate their structure, IDs and URLs. Edit the CSVs and rebuild to update the pages. The handover marks `data/temporal.csv`, `data/activities_places.csv` and `data/findings.csv` as synthetic; their charts remain labeled as such. The kickoff addendum removes prevention advice from the site.

The H-MIP header logo and favicon were copied from the supplied Phase 1 handover assets. The logo is the white PNG used by the current H-MIP site.

## Cloudflare review build

For the temporary Cloudflare staging preview, build with `HMIP_STAGING=1 npm run build`, then run `node scripts/package-staging.mjs` and `node scripts/check-staging.mjs`. Upload `staging-dist/` to the `staging` preview branch of the existing `hmip-bites` Pages project. This build uses root-relative links, marks every page and static response `noindex`, and includes only the three linked draft CSV downloads. The H-MIP GitHub production repository is not changed by this upload.
