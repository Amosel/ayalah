import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  // adapter: node({
  //   mode: "standalone"
  // }),
  integrations: [tailwind()]
});