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
  status: 'A' | 'M' | 'R' | 'C' | 'D';
  filePath: string;
  /** For a rename or copy (R, C): the path it came from. */
  oldPath?: string;
}

/** The git arguments whose output changedPosts() reads. */
export function diffArgs(before: string, after: string): string[] {
  return ['diff', '--name-status', '-z', before, after];
}

const isPostPath = (p: string | undefined): p is string =>
  !!p && p.startsWith('src/content/blog/') && p.endsWith('.md');

/**
 * Added, modified, renamed, copied or deleted posts from `git diff --name-status -z`:
 * NUL-separated records, so no path is ever quoted (plain output quotes
 * non-ASCII names, and even core.quotePath=false quotes tabs, quotes and
 * backslashes; a quoted path never matched and the post was never
 * announced). Rename and copy records (R…, C…) carry two paths; they are
 * kept when the new path is a post, with the old path alongside, and their
 * similarity score is dropped from the status.
 */
export function changedPosts(nameStatusZ: string): ChangedPost[] {
  const fields = nameStatusZ.split('\0');
  const out: ChangedPost[] = [];
  for (let i = 0; i < fields.length; ) {
    const status = fields[i++];
    if (!status) continue;
    if (/^[RC]/.test(status)) {
      const oldPath = fields[i++];
      const filePath = fields[i++];
      if (isPostPath(filePath)) out.push({ status: status[0] as 'R' | 'C', filePath, oldPath });
      continue;
    }
    const filePath = fields[i++];
    if ((status === 'A' || status === 'M' || status === 'D') && isPostPath(filePath)) {
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

const isDraft = (data: Record<string, unknown>) => data.draft === true || data.draft === 'true';

/** A title as a post identity: trimmed, whitespace collapsed, case folded; "" when missing. */
export function titleKey(title: unknown): string {
  return typeof title === 'string' ? title.trim().replace(/\s+/g, ' ').toLowerCase() : '';
}

/**
 * The posts a push should announce. Git pairs files by content, which is not
 * post identity, so the frontmatter title decides on top of git's pairing:
 * - added (A): announced, unless the same push deletes a published post with
 *   the same title (a rename git did not pair, say after heavy edits);
 * - modified (M): announced when it was a draft at BEFORE and is not now;
 * - renamed or copied (R, C): announced when the old path was not a post
 *   (moved in from outside the content tree) or was a draft at BEFORE (a
 *   draft renamed to its publish date and un-drafted); a published post is
 *   skipped only when its title is unchanged, since a new title means git
 *   paired a deleted post with a new one.
 * Titles compare trimmed, whitespace-collapsed and case-insensitive; an
 * empty title never matches. `git` runs git with the given arguments and
 * returns stdout (or throws). In CI anything that would silently drop an
 * announcement throws: missing SHAs, a failed diff, a version of a post that
 * cannot be read. Locally those are warnings and the post is not announced.
 * A branch's first push (all-zero BEFORE_SHA) has nothing to diff against
 * and is skipped either way. The draft flag of the version at AFTER is
 * checked later, by the scripts.
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

  /** The frontmatter of `file` at `rev`; null (locally) when it cannot be read. */
  const frontmatter = (rev: string, file: string, forPost: string): Record<string, unknown> | null => {
    try {
      return matter(git(['show', `${rev}:${file}`])).data;
    } catch (error) {
      if (ci) throw new Error(`could not read ${file} at ${rev}: ${(error as Error).message}`);
      log.warn(`⚠️ Could not read ${file} at ${rev}; not announcing ${forPost}.`, error);
      return null;
    }
  };

  const changes = changedPosts(diff);
  const deleted = changes.filter((c) => c.status === 'D');
  // Titles of the published posts this push deletes; null if one is unreadable.
  let deletedTitles: Set<string> | null | undefined;
  const deletedPublishedTitles = (forPost: string): Set<string> | null => {
    if (deletedTitles !== undefined) return deletedTitles;
    const titles = new Set<string>();
    for (const d of deleted) {
      const data = frontmatter(before, d.filePath, forPost);
      if (!data) return (deletedTitles = null);
      if (!isDraft(data) && titleKey(data.title)) titles.add(titleKey(data.title));
    }
    return (deletedTitles = titles);
  };

  const posts: ChangedPost[] = [];
  for (const post of changes) {
    if (post.status === 'D') continue;
    if (post.status === 'A') {
      if (deleted.length === 0) {
        posts.push(post);
        continue;
      }
      const titles = deletedPublishedTitles(post.filePath);
      if (!titles) continue;
      const now = frontmatter(after, post.filePath, post.filePath);
      if (!now) continue;
      if (titleKey(now.title) && titles.has(titleKey(now.title))) {
        log.log(`⏭️ ${post.filePath} takes the title of a published post this push deletes — a rename, not announcing.`);
        continue;
      }
      posts.push(post);
      continue;
    }
    // The version at BEFORE: the same path for M, the old path for R and C.
    const earlier = post.status === 'M' ? post.filePath : post.oldPath;
    if (!isPostPath(earlier)) {
      log.log(`📢 ${post.filePath} came from ${earlier}, which was not a post — announcing.`);
      posts.push(post);
      continue;
    }
    const was = frontmatter(before, earlier, post.filePath);
    if (!was) continue;
    if (isDraft(was)) {
      log.log(`📢 ${earlier} was a draft before this push — announcing ${post.filePath}.`);
      posts.push(post);
      continue;
    }
    if (post.status === 'M') continue; // an edit to a published post
    const now = frontmatter(after, post.filePath, post.filePath);
    if (!now) continue;
    if (titleKey(was.title) && titleKey(was.title) === titleKey(now.title)) {
      log.log(`⏭️ ${post.filePath} is ${earlier} moved, title unchanged — not announcing.`);
      continue;
    }
    log.log(`📢 ${post.filePath} has a different title from ${earlier}: a new post git paired with a deleted one — announcing.`);
    posts.push(post);
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

function sameUrl(candidate: unknown, url: string): boolean {
  return typeof candidate === 'string' && comparableUrl(candidate) === comparableUrl(url);
}

/**
 * Whether one of the account's recent Bluesky posts (getAuthorFeed items) is
 * the announcement of `url`. Only the account's own top-level posts count
 * (no reposts, no replies, no posts by another DID), and only when `url` is
 * the post's primary link: its external link card, or, for announcements
 * from before link cards, its one and only link facet. A post that merely
 * mentions the URL does not count, so it cannot suppress a real one.
 */
export function blueskyFeedHasAnnouncement(feed: unknown[], url: string, did: string): boolean {
  return feed.some((item: any) => {
    const post = item?.post;
    const record = post?.record;
    if (!record) return false;
    if (item.reason) return false; // a repost
    if (post.author?.did !== did) return false;
    if (record.reply || item.reply) return false;
    const card = record.embed?.external?.uri ?? post.embed?.external?.uri;
    if (card !== undefined) return sameUrl(card, url);
    const links = (record.facets ?? []).flatMap((f: any) =>
      (f?.features ?? []).filter((x: any) => x?.$type === 'app.bsky.richtext.facet#link').map((x: any) => x.uri));
    return links.length === 1 && sameUrl(links[0], url);
  });
}

const HREF_PATTERN = /href="([^"]+)"/g;

/**
 * Whether one of the account's recent Mastodon statuses is the announcement
 * of `url`. Reblogs and replies never count. Otherwise `url` must be the
 * status' primary link: its preview card's URL, or, when there is no card
 * yet, its one and only link to the blog.
 */
export function mastodonStatusesHaveAnnouncement(statuses: unknown[], url: string): boolean {
  const blogHost = new URL(SITE_URL).host;
  return statuses.some((status: any) => {
    if (!status || status.reblog || status.in_reply_to_id) return false;
    if (status.card?.url) return sameUrl(status.card.url, url);
    const content = typeof status.content === 'string' ? status.content : '';
    const blogLinks = [...content.matchAll(HREF_PATTERN)]
      .map((m) => m[1].replace(/&amp;/g, '&'))
      .filter((href) => {
        try {
          return new URL(href).host === blogHost;
        } catch {
          return false;
        }
      });
    return blogLinks.length === 1 && sameUrl(blogLinks[0], url);
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
