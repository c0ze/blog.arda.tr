/**
 * Pure building blocks of the post announcements (post-to-mastodon.ts,
 * post-to-bluesky.ts): which pushed files are posts, the URL a post is served
 * at, the status texts, and the Bluesky record. No I/O and no side effects on
 * import, so tests/announce.test.mjs can cover them without posting anything.
 */
import { createHash } from 'node:crypto';
import path from 'node:path';
import { slug as githubSlug } from 'github-slugger';
import matter from 'gray-matter';
import type { AppBskyEmbedExternal, AppBskyFeedPost, AppBskyRichtextFacet, BlobRef } from '@atproto/api';

export const SITE_URL = 'https://blog.arda.tr';
export const DEFAULT_OG_IMAGE = '/images/og-image.jpg';
/** app.bsky.embed.external#external thumb: maxSize 1,000,000 bytes. */
export const BLUESKY_BLOB_LIMIT = 1_000_000;
export const BLUESKY_LIMIT = 300;
export const MASTODON_LIMIT = 495; // 500 minus a little slack

export interface ChangedPost {
  status: 'A' | 'M';
  filePath: string;
}

/** The git arguments whose output changedPosts() reads. */
export function diffArgs(before: string, after: string): string[] {
  return ['diff', '--name-status', '-z', before, after];
}

/**
 * Added or modified posts from `git diff --name-status -z`: NUL-separated
 * records, so no path is ever quoted (plain output quotes non-ASCII names,
 * and even core.quotePath=false quotes tabs, quotes and backslashes; a
 * quoted path never matched and the post was never announced). Rename and
 * copy records (R…, C…) carry two paths; both are consumed and ignored.
 */
export function changedPosts(nameStatusZ: string): ChangedPost[] {
  const fields = nameStatusZ.split('\0');
  const out: ChangedPost[] = [];
  for (let i = 0; i < fields.length; ) {
    const status = fields[i++];
    if (!status) continue;
    const paths = /^[RC]/.test(status) ? [fields[i++], fields[i++]] : [fields[i++]];
    const filePath = paths[0];
    if ((status === 'A' || status === 'M') && filePath?.startsWith('src/content/blog/') && filePath.endsWith('.md')) {
      out.push({ status, filePath });
    }
  }
  return out;
}

/** Whether this is a CI run (GitHub Actions sets CI=true). */
export function isCI(env: Record<string, string | undefined>): boolean {
  const v = env.CI;
  return !!v && v !== 'false' && v !== '0';
}

/**
 * What to do about a network's credential: post with it; without it, dry-run
 * locally, but fail in CI, where a dry run would be a green step that
 * announced nothing.
 */
export function credentialMode(name: string, env: Record<string, string | undefined>): 'post' | 'dry-run' | 'fail' {
  if (env[name]) return 'post';
  return isCI(env) ? 'fail' : 'dry-run';
}

type Log = { warn: (...args: unknown[]) => void; log: (...args: unknown[]) => void };

/**
 * The posts a push should announce: added (A), or modified (M) from a draft
 * to published; edits to posts that were already published are not. `git`
 * runs git with the given arguments and returns stdout (or throws). In CI
 * anything that would silently drop an announcement throws: missing SHAs, a
 * failed diff, an unreadable earlier version of a modified post. Locally
 * those are warnings. A branch's first push (all-zero BEFORE_SHA) has
 * nothing to diff against and is skipped either way; an added file has no
 * earlier version to read and needs none.
 */
export function postsToAnnounce({ before, after, ci, git, log = console }: {
  before?: string;
  after?: string;
  ci: boolean;
  git: (args: string[]) => string;
  log?: Log;
}): ChangedPost[] {
  const problem = (message: string): ChangedPost[] => {
    if (ci) throw new Error(message);
    log.warn(`⚠️ ${message}; skipping.`);
    return [];
  };
  if (!before || !after) return problem('BEFORE_SHA or AFTER_SHA is not set, so the pushed posts are unknown');
  if (/^0+$/.test(before)) {
    log.warn('⚠️ BEFORE_SHA is all zeros (first push of a branch): nothing to diff against; skipping.');
    return [];
  }

  let diff: string;
  try {
    diff = git(diffArgs(before, after));
  } catch (error) {
    return problem(`git diff ${before} ${after} failed: ${(error as Error).message}`);
  }

  const posts: ChangedPost[] = [];
  for (const post of changedPosts(diff)) {
    if (post.status === 'A') {
      posts.push(post);
      continue;
    }
    let data: Record<string, unknown>;
    try {
      data = matter(git(['show', `${before}:${post.filePath}`])).data;
    } catch (error) {
      if (ci) throw new Error(`could not read ${post.filePath} at ${before}: ${(error as Error).message}`);
      log.warn(`⚠️ Could not read ${post.filePath} at ${before}; not announcing it.`, error);
      continue;
    }
    if (data.draft === true || data.draft === 'true') {
      log.log(`📢 ${post.filePath} was a draft before this push — announcing.`);
      posts.push(post);
    }
  }
  return posts;
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

/**
 * Mastodon's Idempotency-Key for a post: the same post URL always gives the
 * same key, so Mastodon drops a repeat of the request within about an hour
 * (a retry). Later re-runs are caught by mastodonStatusesHaveAnnouncement().
 */
export function idempotencyKey(url: string): string {
  return createHash('sha256').update(url).digest('hex');
}

/**
 * A URL in comparable form: percent-decoded, `&amp;` unescaped, without a
 * trailing slash, so the encoded/decoded and slash/no-slash forms of one post
 * URL compare equal (and a longer slug does not).
 */
export function comparableUrl(url: string): string {
  let u = url.trim().replace(/&amp;/g, '&');
  try {
    u = decodeURI(u);
  } catch {
    // keep it as written
  }
  return u.replace(/\/+$/, '');
}

const URL_PATTERN = /https?:\/\/[^\s"'<>]+/g;

function anySame(candidates: unknown[], url: string): boolean {
  const target = comparableUrl(url);
  return candidates.some((c) => typeof c === 'string' && comparableUrl(c) === target);
}

/**
 * Whether one of the account's recent Bluesky posts (getAuthorFeed items)
 * already announces `url`, by its link card or a link facet.
 */
export function blueskyFeedHasAnnouncement(feed: unknown[], url: string): boolean {
  return feed.some((item: any) => {
    const record = item?.post?.record;
    if (!record) return false;
    const links = [
      record.embed?.external?.uri,
      item.post.embed?.external?.uri,
      ...(record.facets ?? []).flatMap((f: any) => (f?.features ?? []).map((feature: any) => feature?.uri)),
    ];
    return anySame(links, url);
  });
}

/**
 * Whether one of the account's recent Mastodon statuses already announces
 * `url`, in its text (the links in the HTML content) or its preview card.
 */
export function mastodonStatusesHaveAnnouncement(statuses: unknown[], url: string): boolean {
  return statuses.some((status: any) => {
    if (!status) return false;
    const content = typeof status.content === 'string' ? status.content : '';
    return anySame([...(content.match(URL_PATTERN) ?? []), status.card?.url], url);
  });
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

/** The post's OG image under public/ (its own, else the site default), or null if it escapes public/. */
export function ogImageFile(image: unknown, publicDir: string): string | null {
  const src = typeof image === 'string' && image.trim() ? image.trim() : DEFAULT_OG_IMAGE;
  if (!src.startsWith('/') || src.startsWith('//')) return null;
  const file = path.join(publicDir, src);
  return file.startsWith(publicDir + path.sep) ? file : null;
}

const IMAGE_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

/** The MIME type for a card thumbnail, or null when Bluesky won't take it. */
export function thumbMimeType(file: string): string | null {
  return IMAGE_TYPES[path.extname(file).toLowerCase()] ?? null;
}

type ExternalEmbed = AppBskyEmbedExternal.Main & { $type: 'app.bsky.embed.external' };

/** A link card. Bluesky never builds one server-side: the post has to carry it. */
export function buildExternalEmbed({ uri, title, description, thumb }: {
  uri: string;
  title: string;
  description: string;
  thumb?: BlobRef;
}): ExternalEmbed {
  return {
    $type: 'app.bsky.embed.external',
    external: { uri, title, description, ...(thumb ? { thumb } : {}) },
  };
}

/** The app.bsky.feed.post record handed to agent.post(). */
export function buildBlueskyRecord({ text, facets, createdAt, lang, embed }: {
  text: string;
  facets?: AppBskyRichtextFacet.Main[];
  createdAt: string;
  lang?: unknown;
  embed?: ExternalEmbed;
}): Partial<AppBskyFeedPost.Record> & Omit<AppBskyFeedPost.Record, 'createdAt'> {
  return {
    text,
    ...(facets && facets.length ? { facets } : {}),
    createdAt,
    langs: [typeof lang === 'string' && lang ? lang : 'en'],
    ...(embed ? { embed } : {}),
  };
}
