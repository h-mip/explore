// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import storyEmbeds from './src/remark/storyEmbeds.mjs';
import { readFileSync } from 'node:fs';

const staging = process.env.HMIP_STAGING === '1';
const siteSettings = JSON.parse(readFileSync(new URL('./data/site-settings.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: 'https://h-mip.com',
  base: staging ? '/explore-staging' : '/explore',
  integrations: [sitemap({
    filter: (page) => !page.includes('/embed/') && !page.includes('/ca/') && !page.endsWith('.csv'),
  })],
  markdown: { processor: satteri({ mdastPlugins: [storyEmbeds({ base: staging ? '/explore-staging' : '/explore', publishSurveyResults: siteSettings.publishSurveyResults })] }) },
});
