import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.arda.tr',
  integrations: [
    tailwind(),
    sitemap()
  ],
  build: {
    // Inline small assets as base64
    inlineStylesheets: 'auto',
  },
  image: {
    service: {
      entrypoint: './src/magick-service.ts'
    }
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
