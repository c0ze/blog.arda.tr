import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const BASE_URL = 'https://blog.arda.tr';
const BLOG_CONTENT_DIR = path.join(__dirname, '..', 'content', 'blog');
const OUTPUT_FILE = path.join(__dirname, '..', 'dist', 'sitemap.xml');

// Static routes (non-blog pages)
const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/music', priority: '0.8', changefreq: 'weekly' },
];

/**
 * Extract slug from blog post filename.
 * Filename format: YYYY-MM-DD-slug-name.md
 * Returns: YYYY-MM-DD-slug-name (keeping date prefix to match blog routing)
 */
function extractSlugFromFilename(filename: string): string {
    // Remove .md extension only, keep date prefix to match blogPosts.ts slug generation
    return filename.replace(/\.md$/, '');
}

/**
 * Get the last modified date from file stats
 */
function getLastModified(filePath: string): string {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
}

/**
 * Discover all blog posts from content directory
 */
function discoverBlogPosts(): Array<{ path: string; lastmod: string; priority: string; changefreq: string }> {
    const blogPosts: Array<{ path: string; lastmod: string; priority: string; changefreq: string }> = [];

    if (!fs.existsSync(BLOG_CONTENT_DIR)) {
        console.warn(`⚠️ Blog content directory not found: ${BLOG_CONTENT_DIR}`);
        return blogPosts;
    }

    const files = fs.readdirSync(BLOG_CONTENT_DIR);

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(BLOG_CONTENT_DIR, file);
        const slug = extractSlugFromFilename(file);
        const lastmod = getLastModified(filePath);

        blogPosts.push({
            path: `/blog/${slug}`,
            lastmod,
            priority: '0.7',
            changefreq: 'monthly',
        });
    }

    // Sort by path (which effectively sorts by date since slugs are date-based)
    blogPosts.sort((a, b) => b.path.localeCompare(a.path));

    return blogPosts;
}

/**
 * Generate sitemap XML content
 */
function generateSitemapXml(): string {
    const today = new Date().toISOString().split('T')[0];
    const blogPosts = discoverBlogPosts();

    const allRoutes = [
        ...staticRoutes.map(route => ({
            ...route,
            lastmod: today,
        })),
        ...blogPosts,
    ];

    const urlEntries = allRoutes
        .map(
            route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Main execution
function main() {
    // Ensure dist directory exists
    const distDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    const sitemapContent = generateSitemapXml();
    fs.writeFileSync(OUTPUT_FILE, sitemapContent);

    const blogPosts = discoverBlogPosts();
    console.log(`✅ Sitemap generated at: ${OUTPUT_FILE}`);
    console.log(`   - Static pages: ${staticRoutes.length}`);
    console.log(`   - Blog posts: ${blogPosts.length}`);
    console.log(`   - Total URLs: ${staticRoutes.length + blogPosts.length}`);
}

main();
