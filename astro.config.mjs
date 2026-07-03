// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are set by the deploy workflow; defaults suit local dev.
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
});
