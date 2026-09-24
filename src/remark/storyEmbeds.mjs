// Repo-authored Markdown shortcode: {{embed:en:map}} or {{embed:ca:hour}}.
// Only fixed local routes are accepted; arbitrary URLs/HTML cannot enter through a shortcode.
export default function storyEmbeds({ base, publishSurveyResults }) {
  const pattern = /^\{\{embed:(ca|es|en):(map|hour|month|activity|place)\}\}$/;
  return {
    name: "hmip-story-embeds",
    paragraph(node, context) {
      const match = pattern.exec(context.textContent(node).trim());
      if (!match) return;
      const [, locale, chart] = match;
      if (chart !== 'map' && !publishSurveyResults) {
        throw new Error(`Survey embed ${locale}:${chart} is unavailable while publishSurveyResults is false`);
      }
      return { type: "html", value: `<iframe class="story-embed" src="${base}/embed/${locale}/${chart}/" title="H-MIP ${chart} (${locale})" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" width="800" height="520"></iframe>` };
    },
  };
}
