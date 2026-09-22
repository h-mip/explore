// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import storyEmbeds from './src/remark/storyEmbeds.mjs';

const staging = process.env.HMIP_STAGING === '1';
const draftPolicySlugs = new Set(['avis-legal', 'privacitat', 'accessibilitat', 'aviso-legal', 'privacidad', 'accesibilidad', 'legal', 'privacy', 'accessibility']);

export default defineConfig({
  site: 'https://h-mip.com',
  base: staging ? '/explore-staging' : '/explore',
  integrations: staging ? [] : [sitemap({
    filter: (page) => !page.includes('/embed/') && !page.endsWith('.csv') && !draftPolicySlugs.has(new URL(page).pathname.split('/').filter(Boolean).at(-1)),
  })],
  markdown: { processor: satteri({ mdastPlugins: [storyEmbeds({ base: staging ? '/explore-staging' : '/explore' })] }) },
});
