import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kev.in',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
    // Allow raw HTML in markdown (for legacy blog posts)
    remarkRehype: {
      allowDangerousHtml: true,
    },
    rehypePlugins: [
      // Preserve HTML in the output
      () => (tree) => tree,
    ],
  },
  build: {
    format: 'file',
  },
});
