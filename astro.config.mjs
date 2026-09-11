// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://milhamh.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap()],

  markdown: {
    // Code blocks always use Catppuccin Mocha, in both light and dark site mode.
    shikiConfig: {
      theme: 'catppuccin-mocha'
    }
  }
});
