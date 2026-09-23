# Updating research data

This directory contains the site's editable research CSVs. Do not keep duplicate CSVs under `public/`.

## Update a CSV

1. In GitHub, open `data/` and edit a small CSV or upload a replacement with the same filename.
2. Keep the header, column names, and comma-separated UTF-8 format unchanged.
3. Commit the change or open a pull request, according to the repository's review rules.
4. Check the **Validate data and build** result. On the staging repository, a successful push to `main` also rebuilds and publishes the staging site.

If a check fails, read its filename, row, and validation message. Fix the CSV in `data/` and commit again. No one needs to edit generated map files by hand.

## CSV file guide

| File | Controls |
| --- | --- |
| `layer_h3.csv` | Monthly H3 map values and confidence; also the static Home map preview. |
| `layer_municipality.csv` | Monthly municipality map values and confidence, joined to ICGC boundaries by six-digit code. |
| `layers.csv` | Map units, class breaks, period, and H3 resolution. |
| `temporal.csv` | When charts and Home time summaries. |
| `activities_places.csv` | Activities and places charts and Home summaries. |
| `findings.csv` | Home headline findings in three languages. |
| `taxonomy.csv` | Activity and place labels and descriptions. |
| `outputs.csv` | Data & Code resource list. |
| `publications.csv` | About publication list. |

The map CSVs are draft 2025 model data. A supplied update describes their confidence categories as thirds of posterior uncertainty; the research team should approve that explanation before publication. The time, activity, place, finding, and taxonomy CSVs are draft/reference data. Their bounds and activity `rate` values also need interpretation from the research team.

## Developer-maintained files

`data/icgc/municipalities.geojson` and `data/icgc/comarques.geojson` are source boundaries, not routine CSV updates. The build creates GeoJSON, map metadata, and the Home preview in `public/generated/`; these are build artifacts and must not be edited or uploaded. The three map CSV downloads are built directly from the canonical files in this directory.
