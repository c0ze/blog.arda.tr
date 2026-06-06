import { getCollection, type CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

/**
 * Whether a post is visible in the current build: drafts are hidden in
 * production and shown during `astro dev` so they can still be previewed.
 */
function isVisible({ data }: Post): boolean {
  return import.meta.env.PROD ? data.draft !== true : true;
}

/** Comparator ordering posts newest-first by `data.date`. */
function byNewestFirst(a: Post, b: Post): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

/**
 * Returns blog posts sorted newest-first, with drafts excluded in production
 * builds and included during `astro dev` so they can still be previewed.
 *
 * Use this everywhere instead of calling `getCollection('blog')` directly so the
 * draft-visibility rule stays consistent across every page and the RSS feed
 * (otherwise drafts leak into listings/feed as links to pages that are never
 * generated → 404).
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', isVisible);
  return posts.sort(byNewestFirst);
}
