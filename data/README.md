# Updating research data

`data/` is the single editable source for research CSVs. The site builds its map files from these inputs. Do not copy CSVs into `public/` or edit generated GeoJSON.

## Replacing a CSV

1. In GitHub, open `data/`. Edit a small file or upload a replacement with the same filename.
2. Keep the column names, comma-separated format and UTF-8 encoding unchanged. Keep municipality codes as six-digit text.
3. Commit or open a pull request according to the repository's review rules.
4. Check the build result. The staging deployment validates and builds before publishing; a failed build leaves the previous site in place.

The build reports the file and row when it finds invalid data. There is no need to run a map script or upload GeoJSON by hand.

## File guide

| File | Controls |
| --- | --- |
| `layer_h3.csv` | Monthly H3 map estimates, confidence labels and the Home map preview. |
| `layer_municipality.csv` | Monthly municipality estimates, joined to ICGC boundaries by six-digit code. |
| `layers.csv` | Map units, class breaks, period and H3 resolution. |
| `temporal.csv` | Hour and month charts. **Synthetic test values; not public results.** |
| `activities_places.csv` | Activity and place charts. **Synthetic test values; not public results.** The optional `rate` column is blank. |
| `findings.csv` | Home headline figures. **Synthetic test values; not public results.** |
| `taxonomy.csv` | Activity and place names in three languages. Descriptions are not shown. |
| `outputs.csv` | Data & code resource list. Add the model's Zenodo record here when its DOI exists. |
| `publications.csv` | About publication list. |

The three synthetic CSVs contain invented figures and sample counts. They remain in the public source repository for development, but the site hides their pages, navigation, Home figures and chart embeds. **Do not present these files as research results.**

## Publishing verified survey results

`data/site-settings.json` has one `publishSurveyResults` switch. Leave it `false` until verified replacements for `temporal.csv`, `activities_places.csv` and `findings.csv` are committed. Then set it to `true` in the same reviewed change. The build publishes the pages, links, sitemap entries and chart embeds together. `modelProvisional` controls the model badge; the map period still comes from `layers.csv`.

The `rate` column may remain empty. Its table column appears only when values are present. Category descriptions in `taxonomy.csv` are not used.

## Developer-maintained inputs

`data/icgc/municipalities.geojson` and `data/icgc/comarques.geojson` are source boundaries from ICGC's [Divisions administratives](https://www.icgc.cat/ca/Geoinformacio-i-mapes/Dades-i-productes/Geoinformacio-cartografica/Divisions-administratives), not routine CSV edits. Developers maintain them and verify their attribution and edition. The local files do not record an edition. The build creates GeoJSON, map metadata and the Home preview in `public/generated/`; those are artifacts, not source data.
