import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Returns blog posts sorted newest-first, with drafts excluded in production
 * builds and included during `astro dev` so they can still be previewed.
 *
 * Use this everywhere instead of calling `getCollection('blog')` directly so the
 * draft-visibility rule stays consistent across every page and the RSS feed
 * (otherwise drafts leak into listings/feed as links to pages that are never
 * generated → 404).
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
