import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind()],
  adapter: vercel({
    runtime: 'bun',
    webAnalytics: {
      enabled: true,
      imageService: false,
      // devImageService: 'squoosh',
    },
  }),
});