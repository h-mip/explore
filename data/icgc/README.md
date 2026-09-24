# Administrative boundary provenance

These GeoJSON files are developer-maintained snapshots of ICGC's [Divisions administratives](https://www.icgc.cat/ca/Geoinformacio-i-mapes/Dades-i-productes/Geoinformacio-cartografica/Divisions-administratives) geoservice, under CC BY 4.0. They are not routine research-data edits.

| Local file | ICGC WFS/ArcGIS layer | Scale | Features |
| --- | --- | --- | ---: |
| `municipalities.geojson` | [`divisions_administratives_municipis_250000` (ID 5)](https://geoserveis.icgc.cat/vector01/rest/services/divisions_administratives_wfs/MapServer/5) | 1:250,000 | 947 |
| `comarques.geojson` | [`divisions_administratives_comarques_250000` (ID 11)](https://geoserveis.icgc.cat/vector01/rest/services/divisions_administratives_wfs/MapServer/11) | 1:250,000 | 43 |

Both files were committed on 22 September 2026. On 24 September 2026, all features and properties in each local file matched the corresponding live service's GeoJSON output exactly. The verification queried each layer with `where=1=1`, `outFields=*`, `returnGeometry=true`, `outSR=4326` and `f=geojson`, then compared the parsed JSON objects. The ICGC product catalogue listed **20 January 2026** as its last update at verification time. That catalogue date is not an edition field in these GeoJSON files, so do not present it as a separately documented file edition.

Raw local-file SHA-256 checksums at verification:

- `municipalities.geojson`: `ddb807ce88133170d83f339add7ac3550f604b17dad9285141e60c4abcf9c27a`
- `comarques.geojson`: `a7e5601d5f36e1e73d8448d53192ea48ec9f62cc32489951b3f6f2c06c97e21a`

When refreshing either snapshot, record the retrieval date and service layer, keep municipality codes as six-digit strings, and rerun the map generator and full build.
