// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
const staging = process.env.HMIP_STAGING === '1';

export default defineConfig({
  site: staging ? 'https://staging.hmip-bites.pages.dev' : 'https://h-mip.com',
  base: staging ? '/' : '/explore',
});
