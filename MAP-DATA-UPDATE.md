# Map data update: 22 September 2026

These three files replace the synthetic placeholders of the same names in `handover/data/`. They have the same format (spec Appendix A), so no code changes should be needed.

| File | Contents |
|---|---|
| `layer_h3.csv` | 6,445 H3 resolution-7 cells, `m01`–`m12`, `confidence` |
| `layer_municipality.csv` | 947 municipalities, `m01`–`m12`, `confidence` |
| `layers.csv` | Units, class breaks and period for both layers |

- **Values** are an estimated probability expressed as a **percentage**, from about 0.0003% to 72%. The distribution is very skewed, so the five legend classes use the breaks in `layers.csv`: `0.1;0.5;2;5` → <0.1%, 0.1–0.5%, 0.5–2%, 2–5%, ≥5%. Please take the breaks from `layers.csv`, not hard-coded, and show values with sensible rounding (e.g. 2 significant digits).
- **Confidence** (`low` / `medium` / `high`) comes from the model's posterior uncertainty, split into thirds.
- **Status:** these are results from a **draft model run (2025)**. They may be replaced before launch with files in exactly the same format.
