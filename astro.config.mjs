// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';

import react from '@astrojs/react';

// Pulls ```mermaid fences out of the normal code path before Shiki sees them
// (Shiki has no "mermaid" grammar and would error) and turns them into a
// <pre class="mermaid"> holding the raw diagram source. Mermaid.astro renders
// that client-side. Source is HTML-escaped since it becomes literal markup.
function remarkMermaid() {
  const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang !== 'mermaid') return;
      node.type = 'html';
      node.value = `<pre class="mermaid">${escape(node.value)}</pre>`;
    });
  };
}

// Reads the fence's meta string (```ts title="src/utils/sheets.ts") and stamps
// it onto the rendered <pre> as data-title, so CSS can render a filename header
// bar. Astro already exposes the language as data-language on its own.
function transformerCodeTitle() {
  return {
    name: 'code-title',
    pre(node) {
      const raw = this.options.meta?.__raw;
      const title = raw?.match(/title=["']([^"']+)["']/)?.[1];
      if (title) node.properties['data-title'] = title;
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://milhamh.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap(), react()],

  markdown: {
    remarkPlugins: [remarkMermaid],
    // Code blocks always use Catppuccin Mocha, in both light and dark site mode.
    shikiConfig: {
      theme: 'catppuccin-mocha',
      transformers: [transformerCodeTitle()]
    }
  }
});