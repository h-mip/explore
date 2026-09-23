# H-MIP Explore / Explora

An Astro site about human–mosquito interaction in Catalonia. Catalan is the default language; Spanish and English are available under `/es/` and `/en/`.

## Run locally

Use Node.js 22.12 or newer:

```sh
npm ci
npm run dev -- --background
npm run build
```

Stop the development server with `npm run astro -- dev stop`. The build writes to `dist/`.
For page, component, content, and styling changes, use the [Astro documentation](https://docs.astro.build/).

## Data and content

`data/` is the only editable source for research CSVs. See [the data guide](data/README.md) for file purposes and the update workflow. `npm run build` validates the map inputs, creates the map files in `public/generated/`, and builds the site. Do not edit generated files.

The map uses draft 2025 estimates for 6,445 resolution-7 H3 cells and 947 municipalities, with 43 ICGC comarca boundaries. Home, When, and Activities use supplied draft or reference CSVs. Data & Code and About use the supplied output and publication lists. These research views are not public-health advice; the site does not give prevention advice.

Stories are Markdown files in `src/content/stories/`. See [the story guide](src/content/stories/README.txt). Draft stories are not published.

## Publishing

Public staging is at [h-mip.com/explore-staging](https://h-mip.com/explore-staging/) from [h-mip/explore-staging](https://github.com/h-mip/explore-staging). A push to that repository's `main` runs the GitHub Pages workflow and publishes a staging build. Staging pages are marked `noindex`, but the site and repository are public. The tracked `public/robots.txt` is a root-domain template; a copy under this project's path does not control `h-mip.com`.

The production site is intended for `https://h-mip.com/explore/` from the separate [h-mip/explore](https://github.com/h-mip/explore) repository. Staging does not publish to production.

## Before production launch

The research team needs to approve the draft model wording, the other draft/reference data, the meaning of confidence and intervals, and the model data citation and license. The legal, privacy, and accessibility pages are drafts pending review and confirmed contact details. The source code is GPL-3.0-only; that license does not automatically cover research data, boundaries, map tiles, or logos.
