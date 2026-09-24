# Editing page text

The three JSON files in this folder hold page wording in Catalan (`ca.json`), Spanish (`es.json`) and English (`en.json`). Each has sections for `home`, `map`, `data`, `about`, `when` and `activities`. The last two are not published while survey results are switched off.

Edit the words between quotation marks, keeping the field names, brackets and commas in place. Apostrophes can be typed normally. Update all three languages together and preview the pages after the build passes. The map method and legal notices are separate Markdown files in `src/content/map-method/` and `src/content/policies/`; research values belong in `data/`.

Some short interface labels still live in components and should be changed by a developer. Do not use these JSON files for new research figures or legal text.
