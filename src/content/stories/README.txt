Stories are Markdown files with title, date, author, image, locale, summary (optional), and draft frontmatter. The body follows the second --- separator.

The image path is relative to public/; for example image: "logos/hmip-logo-white.png".
Keep draft: true until the text and image are approved. Setting draft: false creates a localized story page and shows the Stories link on the next build.
Use a unique file name for each story and language, for example mosquito-fieldwork-ca.md. Do not place unpublished personal data in a public repository.

To embed the site's map or a chart, put one shortcode on its own line, such as {{embed:ca:map}} or {{embed:en:hour}}. Supported chart names: map, hour, month, activity, place. Match the shortcode language to the story language. The iframe points only to local H-MIP embed routes.
