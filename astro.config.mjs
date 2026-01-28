import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.arda.tr',
  integrations: [
    react(),
    tailwind(),
    sitemap()
  ],
  build: {
    // Inline small assets as base64
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      // Minify CSS
      cssMinify: true,
      // Minify JS
      minify: 'esbuild',
      // Generate sourcemaps for debugging (set to false for smaller builds)
      sourcemap: false,
    }
  }
});
