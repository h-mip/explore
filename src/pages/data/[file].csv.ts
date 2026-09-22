import type { APIRoute, GetStaticPaths } from "astro";
import h3Csv from "../../../data/layer_h3.csv?raw";
import municipalityCsv from "../../../data/layer_municipality.csv?raw";
import layersCsv from "../../../data/layers.csv?raw";

const downloads = {
  layer_h3: h3Csv,
  layer_municipality: municipalityCsv,
  layers: layersCsv,
} as const;

type DownloadName = keyof typeof downloads;

export const getStaticPaths = (() =>
  Object.entries(downloads).map(([file, contents]) => ({
    params: { file },
    props: { contents, filename: `${file}.csv` },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(props.contents, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${props.filename}"`,
    },
  });

export type { DownloadName };
