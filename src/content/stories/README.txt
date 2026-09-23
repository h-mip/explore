Copy `_template.md` to a new, uniquely named Markdown file for each story and language. Frontmatter requires title, date, author, image, locale (ca, es, or en), and draft. Summary is optional.

Image paths are relative to public/ (for example, logos/hmip-logo-white.png). Keep draft: true until the story and image are approved. Set draft: false to publish the story on the next build. This repository is public, so do not commit unpublished personal data.

To embed the map or a chart, put a shortcode on its own line, such as {{embed:en:map}} or {{embed:en:hour}}. Supported types are map, hour, month, activity, and place. Match the shortcode language to the story language.
