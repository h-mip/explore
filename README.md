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

The map page renders the **draft 2025 H3 and municipality model layers** with MapLibre on an OpenStreetMap basemap. It shows all 6,445 original resolution-7 H3 cells, 947 municipality polygons, and 43 ICGC comarca outlines. Month changes, feature selection, confidence, the 12-month profile, municipality search, the accessible table, and shareable URL state use the supplied model data. The Home map teaser is a static August rendering of the same real H3 cells. When, Activities, and Home findings now read their canonical draft/reference CSVs; these are not approved scientific conclusions. None of these views is public-health advice.

The data update ZIP supplied on 22 September 2026 has been applied to `data/layer_h3.csv`; the municipality and metadata files already matched it. The `data/` directory is the single editable source for research CSVs; see [`data/README.md`](data/README.md) for the update workflow and file descriptions. `npm run build` validates the map inputs, regenerates `public/generated/` (including the static Home preview), and then builds the site. Scientific wording, method, uncertainty, and attribution need review before launch. The three map CSV downloads on Data & Code are emitted from the canonical files during the Astro build, so they do not require copies under `public/`. No license or citation was supplied for the draft model files.

The handover marks `data/outputs.csv` and `data/publications.csv` as real source lists. Data & Code displays all seven supplied datasets and code records, and About lists the 14 supplied publications newest first. Both pages read these files at build time and validate their structure, IDs and URLs. The handover marks `data/temporal.csv`, `data/activities_places.csv`, `data/findings.csv` and `data/taxonomy.csv` as draft/reference or synthetic until confirmed; the site labels them accordingly. Their shares and bounds are read from CSV at build time. The interval method and activity `rate` definition remain undocumented. The kickoff addendum removes prevention advice from the site.

The H-MIP header logo and favicon were copied from the supplied Phase 1 handover assets. The logo is the white PNG used by the current H-MIP site.

## Stories, embeds and legal review

Stories live in `src/content/stories/` as Markdown with title, date, author, image, locale and body. `draft: true` entries are not routed or linked. Changing a reviewed story to `draft: false` publishes it on the next build without code changes. `{{embed:en:map}}` and corresponding `hour`, `month`, `activity` and `place` shortcodes embed the site's own accessible routes; see `src/content/stories/README.txt`. Standalone iframe routes are `/explore/embed/{ca|es|en}/{map|hour|month|activity|place}/`.

The site source code has a GPL-3.0-only `LICENSE`; research data, ICGC boundaries, OpenStreetMap tiles, logos and third-party material have separate rights. The three-language legal, privacy and accessibility pages are **drafts** marked noindex. The approved legal text, responsible controller and contact details were not present in the local handover and require project/legal review.

## Staging status

The public staging site is live at **https://h-mip.com/explore-staging/** from the separate [`h-mip/explore-staging`](https://github.com/h-mip/explore-staging) repository. Its GitHub Pages source is GitHub Actions. Pushing to that repository's `main` runs `.github/workflows/deploy-staging.yml`, which installs dependencies, validates and generates the map data, builds the Astro site with `/explore-staging/` URLs, and deploys `dist/`. The staging pages carry `noindex, nofollow`; this discourages search indexing but does not make the draft content private. The older Cloudflare review-build scripts are historical previews, not the staging deployment path.

The production [`h-mip/explore`](https://github.com/h-mip/explore) repository and `https://h-mip.com/explore/` remain separate and have not been deployed as part of staging. Keep scientific, data-rights, and legal review open before any production launch. This repo's `public/robots.txt` must be placed at the domain root (`https://h-mip.com/robots.txt`) by the host; a copy under `/explore/` or `/explore-staging/` is not authoritative for crawlers.
