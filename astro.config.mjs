import { defineConfig, passthroughImageService } from 'astro/config';
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
    // No build-time image optimization: content images live in public/ and are
    // referenced directly, so nothing uses <Image>/getImage. Passthrough avoids
    // falling back to Astro's sharp-based default service (sharp was removed).
    service: passthroughImageService(),
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
