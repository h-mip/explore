Copy `_template.md` to a new, uniquely named Markdown file for each story and language. Frontmatter requires title, date, author, locale (ca, es, or en), and draft. Summary, image, image_alt, and stagingOnly are optional. Set stagingOnly: true for a staging example that must never appear in a production build.

Image paths are relative to public/ (for example, logos/hmip-logo-white.png). Add image_alt to describe a meaningful image. Keep draft: true until the story is approved. Set draft: false to publish it on the next build. This repository is public, so do not commit unpublished personal data.

To embed the map or a chart, put a shortcode on its own line, such as {{embed:en:map}} or {{embed:en:hour}}. Match the shortcode language to the story language. Staging previews survey embeds with synthetic data; production makes them available only after verified survey results are enabled. Do not copy staging-only links or unverified claims into a production story.
