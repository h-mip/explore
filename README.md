# H-MIP Bites

An Astro site for exploring questions about human–mosquito interaction in Catalonia. It currently builds static pages in English (`/en/`), Spanish (`/es/`) and Catalan (`/ca/`).

## Run locally

```sh
npm install
npm run astro -- dev --background
npm run build
```

Use `npm run astro -- dev stop` to stop the background server. The static build is written to `dist/`.

## Demonstration data

**All numeric values on Home, Map, When and Activities are synthetic.** They are for design and interaction review only, not H-MIP findings or public-health guidance. Every public page labels the demonstration values.

| Area | Current source | Replacement needed |
| --- | --- | --- |
| Home charts and headline values | `src/data/home.ts` | Reviewed headline results and chart data |
| Map geometry, sample places and monthly index | `src/data/map.ts` | Approved spatial data, geographic boundaries, methods, uncertainty and attribution |
| When charts | `src/data/when.ts` | Reviewed temporal results and intervals |
| Activities and places | `src/data/activities.ts` | Reviewed activity and place results |
| Data & Code catalogue | `src/data/outputs.ts` | Approved public output records with working links and citation details |

The map outline, grid cells and place positions are **schematic**. Its grid is not H3, and its points are not official municipality geometry. The map's controls, URL state, accessible table and translations can be reviewed now; the visual data layer should be replaced before presenting it as geographic research output.

The About and Data & Code pages link to the [H-MIP project website](https://h-mip.com/en/) and the [European Commission project record](https://cordis.europa.eu/project/id/853271). The catalogue does not invent datasets, code repositories, DOIs or licenses.
