/**
 * Pure building blocks of the post announcements (post-to-mastodon.ts,
 * post-to-bluesky.ts): which pushed files are posts, the URL a post is served
 * at and the status texts. No I/O and no side effects on
 * import, so tests/announce.test.mjs can cover them without posting anything.
 */
import path from 'node:path';
import { slug as githubSlug } from 'github-slugger';

export const SITE_URL = 'https://blog.arda.tr';
export const BLUESKY_LIMIT = 300;
export const MASTODON_LIMIT = 495; // 500 minus a little slack

export interface ChangedPost {
  status: 'A' | 'M';
  filePath: string;
}

/**
 * Added or modified posts from `git -c core.quotePath=false diff
 * --name-status`. (Without quotePath=false git quotes non-ASCII paths, and
 * those posts were never announced.)
 */
export function changedPosts(nameStatus: string): ChangedPost[] {
  return nameStatus
    .split('\n')
    .map((line) => line.split('\t'))
    .filter(([status, filePath]) => (status === 'A' || status === 'M') && filePath !== undefined)
    .map(([status, filePath]) => ({ status: status as 'A' | 'M', filePath }))
    .filter(({ filePath }) => filePath.startsWith('src/content/blog/') && filePath.endsWith('.md'));
}

/**
 * The URL slug Astro gives a post: the glob loader slugifies each path segment
 * with github-slugger (or takes a frontmatter `slug`), and the site keeps the
 * last segment (src/lib/posts.ts getSlug). `2011-07-05-new-nook-！.md` is
 * served at /blog/2011-07-05-new-nook-/.
 */
export function postSlug(filePath: string, data: { slug?: unknown } = {}): string {
  if (typeof data.slug === 'string' && data.slug) return data.slug.split('/').pop() ?? data.slug;
  return githubSlug(path.basename(filePath).replace(/\.md$/, ''));
}

/** The post's canonical URL, trailing slash included, safe to paste anywhere. */
export function postUrl(slug: string): string {
  return encodeURI(`${SITE_URL}/blog/${slug}/`);
}

export function hashtags(tags: unknown): string {
  if (!Array.isArray(tags)) return '';
  return tags
    .map((tag) => String(tag).replace(/[^a-zA-Z0-9_]/g, ''))
    .filter(Boolean)
    .map((tag) => `#${tag}`)
    .join(' ');
}

export interface Announcement {
  title: string;
  excerpt: string;
  url: string;
  tags: unknown;
}

function compose(title: string, excerpt: string, url: string, tags: string): string {
  let s = `📝 New blog post: ${title}\n\n`;
  if (excerpt) s += `${excerpt}\n\n`;
  s += url;
  if (tags) s += `\n\n${tags}`;
  return s;
}

/**
 * The Mastodon status. Mastodon rejects statuses over 500 characters (422)
 * and counts any URL as 23, so an over-long excerpt is trimmed to fit.
 */
export function composeMastodonStatus({ title, excerpt, url, tags }: Announcement, limit = MASTODON_LIMIT): string {
  const tagText = hashtags(tags);
  const effectiveLength = (s: string) => s.length - url.length + 23;
  const full = compose(title, excerpt, url, tagText);
  if (effectiveLength(full) <= limit) return full;
  const overhead = effectiveLength(full) - excerpt.length;
  const room = Math.max(limit - overhead - 1, 0);
  const trimmed = room > 0 ? `${excerpt.slice(0, room).trimEnd()}…` : '';
  return compose(title, trimmed, url, tagText);
}

const segmenter = new Intl.Segmenter();
export const graphemes = (s: string): string[] => Array.from(segmenter.segment(s), (g) => g.segment);
const clip = (s: string, n: number) => (n > 0 ? `${graphemes(s).slice(0, n).join('').trimEnd()}…` : '');

/**
 * The Bluesky text, at most 300 graphemes: the excerpt is trimmed first, then
 * dropped; if the title, URL and hashtags alone are still too long, the title
 * is shortened (then the hashtags dropped) rather than failing the post.
 */
export function composeBlueskyText({ title, excerpt, url, tags }: Announcement, limit = BLUESKY_LIMIT): string {
  const tagText = hashtags(tags);
  const len = (s: string) => graphemes(s).length;
  const full = compose(title, excerpt, url, tagText);
  if (len(full) <= limit) return full;

  const bare = compose(title, '', url, tagText);
  if (len(bare) <= limit) {
    const room = limit - len(bare) - 2 /* \n\n */ - 1; /* … */
    return room > 0 ? compose(title, clip(excerpt, room), url, tagText) : bare;
  }

  for (const t of [tagText, '']) {
    const titleRoom = limit - len(compose('', '', url, t)) - 1;
    if (titleRoom > 0) return compose(clip(title, titleRoom), '', url, t);
  }
  return url;
}
