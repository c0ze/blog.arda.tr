import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import rehypeRaw from 'rehype-raw';
import { rehypeDemoteHeadings, rehypeMediaLoading } from './src/lib/rehype.mjs';

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
  markdown: {
    // rehype-raw first, so the steps below also see the raw HTML in posts
    // (Astro would otherwise only parse it after every user plugin).
    // Code colours come from the rendition tokens (the --astro-code-* map in
    // global.css), so code blocks follow all four renditions.
    shikiConfig: {
      theme: 'css-variables',
      // no ReScript grammar in Shiki; the posts' snippets are mostly JSX, which
      // the nearest grammar (OCaml) would misread, so they stay plain text
      langAlias: { rescript: 'plaintext' },
    },
    rehypePlugins: [rehypeRaw, rehypeDemoteHeadings, rehypeMediaLoading],
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
