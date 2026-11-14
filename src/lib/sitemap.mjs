/** A post's URL starts its slug with the post's date: /blog/YYYY-MM-DD-…/. */
const POST_DATE = /^\/blog\/(\d{4}-\d{2}-\d{2})-/;

/**
 * The sitemap integration's serialize hook: a post's entry gets its date as
 * lastmod. The hook sees only the URL, so the date comes from the slug, which
 * matches the frontmatter date for every post (tests/sitemap.test.mjs checks).
 * Other pages are left as they are.
 */
export function sitemapItem(item) {
  const date = POST_DATE.exec(new URL(item.url).pathname)?.[1];
  return date ? { ...item, lastmod: date } : item;
}
