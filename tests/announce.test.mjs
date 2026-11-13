import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import test from 'node:test';
import {
  changedPosts,
  composeBlueskyText,
  composeMastodonStatus,
  graphemes,
  postSlug,
  postUrl,
} from '../scripts/lib/announce.ts';

// The announce scripts post to Mastodon and Bluesky from CI; these tests run
// only their pure parts and never post anything.

const repo = fileURLToPath(new URL('../', import.meta.url));

async function postFiles(dir = join(repo, 'src/content/blog')) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await postFiles(path));
    else if (entry.name.endsWith('.md')) out.push(relative(repo, path));
  }
  return out;
}

// `git diff --name-status -z` gives NUL-separated records, so no path is ever
// quoted (quotePath=false still quoted tabs, quotes and backslashes, and a
// quoted path never matched src/content/blog/). Renames and copies carry two
// paths; both are consumed so the next record still lines up, and a record
// whose new path is a post is kept with its old path, so postsToAnnounce()
// can tell a moved published post (not new) from a post that arrived by a
// rename (new).
test('pushed posts are read from NUL-separated name-status output', () => {
  const out = [
    'A', 'src/content/blog/2011/2011-02-19-日本いろいろ.md',
    'R100', 'src/content/blog/2026/old.md', 'src/content/blog/2026/new-name.md',
    'M', 'src/content/blog/2026/2026-10-27-dergi-coze-org.md',
    'C075', 'src/content/blog/2026/a.md', 'src/content/blog/2026/copy.md',
    'D', 'src/content/blog/2010/2010-05-10-les-claypool.md',
    'A', 'src/content/blog/2026/tab\there "quoted" back\\slash.md',
    'A', 'public/images/x.png',
    'M', 'src/content/blog/2026/notes.txt',
    '',
  ].join('\0');
  assert.deepEqual(changedPosts(out), [
    { status: 'A', filePath: 'src/content/blog/2011/2011-02-19-日本いろいろ.md' },
    { status: 'R', filePath: 'src/content/blog/2026/new-name.md', oldPath: 'src/content/blog/2026/old.md' },
    { status: 'M', filePath: 'src/content/blog/2026/2026-10-27-dergi-coze-org.md' },
    { status: 'C', filePath: 'src/content/blog/2026/copy.md', oldPath: 'src/content/blog/2026/a.md' },
    { status: 'A', filePath: 'src/content/blog/2026/tab\there "quoted" back\\slash.md' },
  ]);
  // a post renamed out of the content tree is no longer a post
  assert.deepEqual(changedPosts('R100\0src/content/blog/2026/x.md\0attic/x.md\0'), []);
  assert.deepEqual(changedPosts(''), []);
});

// The announced link must be the URL the site serves. Astro slugifies the
// file name (github-slugger), so the raw basename was wrong for some posts.
test('the announced URL is the one Astro serves, with the trailing slash', () => {
  assert.equal(postSlug('src/content/blog/2011/2011-07-05-new-nook-！.md'), '2011-07-05-new-nook-');
  assert.equal(postSlug('src/content/blog/2010/2010-07-30-日光きらいな日本人.md'), '2010-07-30-日光きらいな日本人');
  assert.equal(postSlug('src/content/blog/2026/2026-10-27-dergi-coze-org.md'), '2026-10-27-dergi-coze-org');
  assert.equal(postSlug('src/content/blog/2026/x.md', { slug: '2026/custom' }), 'custom');
  assert.equal(postUrl('2011-07-05-new-nook-'), 'https://blog.arda.tr/blog/2011-07-05-new-nook-/');
  assert.equal(
    postUrl('2010-07-30-日光きらいな日本人'),
    'https://blog.arda.tr/blog/2010-07-30-%E6%97%A5%E5%85%89%E3%81%8D%E3%82%89%E3%81%84%E3%81%AA%E6%97%A5%E6%9C%AC%E4%BA%BA/',
  );
});

// Every real post: an ASCII-safe file name is served as itself, so the slug
// logic only ever differs where Astro's slugifier changes the name.
test('every real post file maps to a slug made of URL-safe characters', async () => {
  const files = await postFiles();
  assert.ok(files.length > 100, 'expected the real posts');
  for (const file of files) {
    const base = file.split('/').pop().replace(/\.md$/, '');
    const slug = postSlug(file);
    if (/^[a-z0-9-]+$/.test(base)) assert.equal(slug, base, file);
    assert.doesNotMatch(slug, /[\s!！?？/A-Z]/, file);
  }
});

const long = (n, word = 'word') => Array.from({ length: n }, (_, i) => `${word}${i}`).join(' ');

test('a Mastodon status stays under the limit by trimming the excerpt', () => {
  const url = postUrl('2026-10-27-dergi-coze-org');
  const status = composeMastodonStatus({ title: 'T', excerpt: long(200), url, tags: ['ai', 'dev'] });
  assert.ok(status.length - url.length + 23 <= 495);
  assert.match(status, /…\n\nhttps:\/\/blog\.arda\.tr\/blog\/2026-10-27-dergi-coze-org\/\n\n#ai #dev$/);
});

test('a Bluesky post stays within 300 graphemes', () => {
  const url = postUrl('2026-10-27-dergi-coze-org');
  const text = composeBlueskyText({ title: 'T', excerpt: long(100), url, tags: ['ai'] });
  assert.ok(graphemes(text).length <= 300);
  assert.ok(text.includes(url) && text.endsWith('#ai'));
});

// A title that alone overflows 300 graphemes used to leave a text Bluesky
// rejects; the title is shortened instead, and the link always survives.
test('an over-long title is shortened rather than failing the post', () => {
  const url = postUrl('2026-10-27-dergi-coze-org');
  const text = composeBlueskyText({ title: long(80, 'başlık'), excerpt: 'excerpt', url, tags: ['ai'] });
  assert.ok(graphemes(text).length <= 300, `${graphemes(text).length} graphemes`);
  assert.ok(text.includes(url));
  assert.match(text, /^📝 New blog post: başlık0 .*…\n\nhttps/s);
  assert.doesNotMatch(text, /excerpt/);
});

// Bluesky never builds link cards server-side: a post without an embed shows
// a bare URL. The record must carry the card (and the post's language).
test('the Bluesky record carries a link card and the post language', async () => {
  const { buildBlueskyRecord, buildExternalEmbed } = await import('../scripts/lib/announce.ts');
  const thumb = { $type: 'blob', ref: { $link: 'bafk' }, mimeType: 'image/png', size: 1234 };
  const embed = buildExternalEmbed({ uri: 'https://blog.arda.tr/blog/x/', title: 'T', description: 'D', thumb });
  assert.deepEqual(embed, {
    $type: 'app.bsky.embed.external',
    external: { uri: 'https://blog.arda.tr/blog/x/', title: 'T', description: 'D', thumb },
  });
  const facets = [{ index: { byteStart: 0, byteEnd: 1 }, features: [] }];
  assert.deepEqual(
    buildBlueskyRecord({ text: 'hi', facets, createdAt: '2026-11-12T00:00:00.000Z', lang: 'tr', embed }),
    { text: 'hi', facets, createdAt: '2026-11-12T00:00:00.000Z', langs: ['tr'], embed },
  );
});

// A card without a thumbnail is still a card; a post without a card (the
// embed could not be built) is still a post, in the default language.
test('the record degrades to no thumb, then to a plain post', async () => {
  const { buildBlueskyRecord, buildExternalEmbed } = await import('../scripts/lib/announce.ts');
  assert.deepEqual(buildExternalEmbed({ uri: 'u', title: 't', description: '' }).external, { uri: 'u', title: 't', description: '' });
  assert.deepEqual(buildBlueskyRecord({ text: 'hi', createdAt: 'c' }), { text: 'hi', createdAt: 'c', langs: ['en'] });
});

test('the card thumbnail is the post OG image under public/, else the default', async () => {
  const { ogImageFile, thumbMimeType } = await import('../scripts/lib/announce.ts');
  assert.equal(ogImageFile('/images/og/a.webp', '/repo/public'), '/repo/public/images/og/a.webp');
  assert.equal(ogImageFile('', '/repo/public'), '/repo/public/images/og-image.jpg');
  assert.equal(ogImageFile(undefined, '/repo/public'), '/repo/public/images/og-image.jpg');
  assert.equal(ogImageFile('/../../etc/passwd', '/repo/public'), null);
  assert.equal(ogImageFile('https://example.com/a.png', '/repo/public'), null);
  assert.equal(thumbMimeType('/x/a.JPG'), 'image/jpeg');
  assert.equal(thumbMimeType('/x/a.svg'), null);
});

// A re-run of the announce job (or a retried request) must not double-post:
// Mastodon drops a status whose Idempotency-Key it has seen, so the key has
// to be the same for the same post and differ between posts.
test('the Mastodon idempotency key is stable per post URL', async () => {
  const { idempotencyKey } = await import('../scripts/lib/announce.ts');
  const a = postUrl('2026-10-27-dergi-coze-org');
  assert.equal(idempotencyKey(a), idempotencyKey(a));
  assert.match(idempotencyKey(a), /^[0-9a-f]{64}$/);
  assert.notEqual(idempotencyKey(a), idempotencyKey(postUrl('2026-11-01-a-year-of-green-squares')));
});

// Re-running the announce job (say Mastodon failed, Bluesky succeeded) must
// not post the same entry again. Each script first looks through the
// account's recent posts; these matchers decide whether one already links
// the entry, whatever form the URL took.
const ME = 'did:plc:me';
const linkFacet = (uri) => ({ index: { byteStart: 0, byteEnd: 1 }, features: [{ $type: 'app.bsky.richtext.facet#link', uri }] });
const tagFacet = (tag) => ({ index: { byteStart: 0, byteEnd: 1 }, features: [{ $type: 'app.bsky.richtext.facet#tag', tag }] });
const feedItem = (record, extra = {}) => ({ post: { uri: 'at://x', author: { did: ME }, record, ...extra.post }, ...extra.item });

// Built the way post-to-bluesky.ts builds its own posts: composed text, a
// link facet for the URL and tag facets, and the external link card.
test('a Bluesky announcement made by this script is recognised', async () => {
  const { blueskyFeedHasAnnouncement, buildBlueskyRecord, buildExternalEmbed } = await import('../scripts/lib/announce.ts');
  const url = postUrl('2010-07-30-日光きらいな日本人');
  const text = composeBlueskyText({ title: '日光きらいな日本人', excerpt: '', url, tags: ['legacy'] });
  const record = buildBlueskyRecord({
    text,
    facets: [linkFacet(url), tagFacet('legacy')],
    createdAt: '2026-11-12T00:00:00.000Z',
    lang: 'ja',
    embed: buildExternalEmbed({ uri: url, title: 't', description: '' }),
  });
  assert.equal(blueskyFeedHasAnnouncement([feedItem(record)], url, ME), true);
  // the same, matched across the encoded/decoded and slash/no-slash forms
  const decoded = 'https://blog.arda.tr/blog/2010-07-30-日光きらいな日本人';
  assert.equal(blueskyFeedHasAnnouncement([feedItem({ ...record, embed: buildExternalEmbed({ uri: decoded, title: 't', description: '' }) })], url, ME), true);
  // an announcement from before link cards: one link facet, the post's URL
  assert.equal(blueskyFeedHasAnnouncement([feedItem({ text, facets: [linkFacet(decoded), tagFacet('legacy')] })], url, ME), true);
  assert.equal(blueskyFeedHasAnnouncement([], url, ME), false);
  assert.equal(blueskyFeedHasAnnouncement([{ post: {} }, {}], url, ME), false);
});

// Only this account's own announcement counts: a mere mention of the URL
// must not suppress a real announcement.
test('Bluesky reposts, replies and incidental links are not announcements', async () => {
  const { blueskyFeedHasAnnouncement, buildExternalEmbed } = await import('../scripts/lib/announce.ts');
  const url = postUrl('2026-10-27-dergi-coze-org');
  const card = buildExternalEmbed({ uri: url, title: 't', description: '' });
  // someone else's post that this account reposted (Codex's case)
  const repost = { post: { author: { did: 'did:plc:someone' }, record: { text: url, embed: card, facets: [linkFacet(url)] } }, reason: { $type: 'app.bsky.feed.defs#reasonRepost' } };
  assert.equal(blueskyFeedHasAnnouncement([repost], url, ME), false);
  assert.equal(blueskyFeedHasAnnouncement([{ ...repost, post: { ...repost.post, author: { did: ME } } }], url, ME), false, 'a repost reason is enough');
  // a reply that links the post
  assert.equal(blueskyFeedHasAnnouncement([feedItem({ text: url, embed: card, reply: { root: {}, parent: {} } })], url, ME), false);
  // a post carding another article that also links this one in its text
  const otherCard = buildExternalEmbed({ uri: 'https://blog.arda.tr/blog/other/', title: 't', description: '' });
  assert.equal(blueskyFeedHasAnnouncement([feedItem({ text: 'x', embed: otherCard, facets: [linkFacet(url)] })], url, ME), false);
  // a post with several links, one of them this post
  assert.equal(blueskyFeedHasAnnouncement([feedItem({ text: 'x', facets: [linkFacet('https://example.com/'), linkFacet(url)] })], url, ME), false);
});

// Mastodon renders the status this script sends: text paragraphs, the post
// link (display text shortened), hashtag links into the instance, and later
// a preview card for the post.
const mastodonContent = (href) =>
  '<p>📝 New blog post: MÜJDE!</p><p>Excerpt</p>' +
  `<p><a href="${href}" target="_blank" rel="nofollow noopener" translate="no"><span class="invisible">https://</span><span class="ellipsis">blog.arda.tr/blog/2026-10-27-d</span><span class="invisible">ergi-coze-org/</span></a></p>` +
  '<p><a href="https://mastodon.world/tags/retro" class="mention hashtag" rel="tag">#<span>retro</span></a></p>';

test('a Mastodon announcement made by this script is recognised', async () => {
  const { mastodonStatusesHaveAnnouncement } = await import('../scripts/lib/announce.ts');
  const url = postUrl('2026-10-27-dergi-coze-org');
  const status = { id: '1', reblog: null, in_reply_to_id: null, content: mastodonContent(url), card: { url } };
  assert.equal(mastodonStatusesHaveAnnouncement([status], url), true);
  assert.equal(mastodonStatusesHaveAnnouncement([{ ...status, card: null }], url), true, 'before the card is fetched');
  assert.equal(mastodonStatusesHaveAnnouncement([{ ...status, card: null, content: mastodonContent('https://blog.arda.tr/blog/2026-10-27-dergi-coze-org') }], url), true, 'without the slash');
  const prefixOnly = { ...status, card: null, content: mastodonContent('https://blog.arda.tr/blog/2026-10-27-dergi-coze-org-2/') };
  assert.equal(mastodonStatusesHaveAnnouncement([prefixOnly], url), false, 'a longer slug is another post');
  assert.equal(mastodonStatusesHaveAnnouncement([{ content: null }], url), false);
});

test('Mastodon reblogs, replies and incidental links are not announcements', async () => {
  const { mastodonStatusesHaveAnnouncement } = await import('../scripts/lib/announce.ts');
  const url = postUrl('2026-10-27-dergi-coze-org');
  const own = { id: '1', reblog: null, in_reply_to_id: null, content: mastodonContent(url), card: { url } };
  assert.equal(mastodonStatusesHaveAnnouncement([{ ...own, reblog: { id: '9', content: own.content } }], url), false);
  assert.equal(mastodonStatusesHaveAnnouncement([{ ...own, in_reply_to_id: '7' }], url), false);
  // an older status whose card is another article but whose text links this one (Codex's case)
  assert.equal(mastodonStatusesHaveAnnouncement([{ ...own, card: { url: 'https://blog.arda.tr/blog/other/' } }], url), false);
  // two blog links, one of them this post
  const two = `<p><a href="https://blog.arda.tr/blog/other/">a</a> and <a href="${url}">b</a></p>`;
  assert.equal(mastodonStatusesHaveAnnouncement([{ ...own, card: null, content: two }], url), false);
});

// In CI a failure that would silently skip an announcement must fail the
// step instead (a green run that announced nothing hides the problem);
// local runs keep their forgiving dry-run behaviour.
test('missing credentials fail in CI and dry-run locally', async () => {
  const { credentialMode } = await import('../scripts/lib/announce.ts');
  assert.equal(credentialMode('MASTODON_ACCESS_TOKEN', { MASTODON_ACCESS_TOKEN: 't', CI: 'true' }), 'post');
  assert.equal(credentialMode('MASTODON_ACCESS_TOKEN', { CI: 'true' }), 'fail');
  assert.equal(credentialMode('MASTODON_ACCESS_TOKEN', {}), 'dry-run');
  assert.equal(credentialMode('MASTODON_ACCESS_TOKEN', { CI: 'false' }), 'dry-run');
});

const quiet = { warn() {}, log() {} };
const gitFake = (files) => (args) => {
  if (args.includes('diff')) {
    if (files.diffError) throw new Error('bad revision');
    return files.diff;
  }
  const spec = args[args.length - 1];
  if (!(spec in files)) throw new Error(`fatal: path '${spec}' does not exist`);
  return files[spec];
};

test('posts to announce: added, or flipped from draft; already published edits are not', async () => {
  const { postsToAnnounce } = await import('../scripts/lib/announce.ts');
  const git = gitFake({
    diff: 'A\0src/content/blog/2026/new.md\0M\0src/content/blog/2026/undrafted.md\0M\0src/content/blog/2026/edited.md\0',
    'b1:src/content/blog/2026/undrafted.md': '---\ntitle: x\ndraft: true\n---\n',
    'b1:src/content/blog/2026/edited.md': '---\ntitle: y\n---\n',
  });
  const posts = postsToAnnounce({ before: 'b1', after: 'a1', ci: true, git, log: quiet });
  assert.deepEqual(posts.map((p) => p.filePath), ['src/content/blog/2026/new.md', 'src/content/blog/2026/undrafted.md']);
});

test('in CI a failed git diff or an unreadable earlier version fails; locally it skips', async () => {
  const { postsToAnnounce } = await import('../scripts/lib/announce.ts');
  const broken = gitFake({ diffError: true });
  assert.throws(() => postsToAnnounce({ before: 'b1', after: 'a1', ci: true, git: broken, log: quiet }), /git diff/);
  assert.deepEqual(postsToAnnounce({ before: 'b1', after: 'a1', ci: false, git: broken, log: quiet }), []);

  const missingBefore = gitFake({ diff: 'M\0src/content/blog/2026/x.md\0' });
  assert.throws(() => postsToAnnounce({ before: 'b1', after: 'a1', ci: true, git: missingBefore, log: quiet }), /x\.md/);
  assert.deepEqual(postsToAnnounce({ before: 'b1', after: 'a1', ci: false, git: missingBefore, log: quiet }), []);

  assert.throws(() => postsToAnnounce({ before: undefined, after: 'a1', ci: true, git: missingBefore, log: quiet }), /BEFORE_SHA/);
  assert.deepEqual(postsToAnnounce({ before: undefined, after: 'a1', ci: false, git: missingBefore, log: quiet }), []);
});

// An added file has no earlier version to read, and a branch's first push
// has no "before" commit: neither is an error.
test('a new file or a first push is not an error', async () => {
  const { postsToAnnounce } = await import('../scripts/lib/announce.ts');
  const git = gitFake({ diff: 'A\0src/content/blog/2026/new.md\0' });
  assert.deepEqual(postsToAnnounce({ before: 'b1', after: 'a1', ci: true, git, log: quiet }).map((p) => p.status), ['A']);
  assert.deepEqual(postsToAnnounce({ before: '0000000000000000000000000000000000000000', after: 'a1', ci: true, git, log: quiet }), []);
});

// A rename is one record (R…), never an A: a post brought into the content
// tree by `git mv`, or a draft renamed to its publish date and un-drafted in
// the same push, used to be dropped silently. Only a rename of a post that
// was already published stays unannounced (moving a post is not a new post).
test('posts to announce: renamed posts count unless they were already published', async () => {
  const { postsToAnnounce } = await import('../scripts/lib/announce.ts');
  const git = gitFake({
    diff: [
      'R100', 'drafts/imported.md', 'src/content/blog/2026/imported.md',
      'R087', 'src/content/blog/2026/2026-01-01-wip.md', 'src/content/blog/2026/2026-11-14-wip.md',
      'R100', 'src/content/blog/2025/moved.md', 'src/content/blog/2026/moved.md',
      'R095', 'src/content/blog/2026/notes.txt', 'src/content/blog/2026/notes.md',
      '',
    ].join('\0'),
    'b1:src/content/blog/2026/2026-01-01-wip.md': '---\ntitle: wip\ndraft: true\n---\n',
    'b1:src/content/blog/2025/moved.md': '---\ntitle: moved\n---\n',
  });
  const posts = postsToAnnounce({ before: 'b1', after: 'a1', ci: true, git, log: quiet });
  assert.deepEqual(posts.map((p) => p.filePath), [
    'src/content/blog/2026/imported.md',
    'src/content/blog/2026/2026-11-14-wip.md',
    'src/content/blog/2026/notes.md',
  ]);
});

test('a renamed post whose earlier version cannot be read fails in CI, skips locally', async () => {
  const { postsToAnnounce } = await import('../scripts/lib/announce.ts');
  const git = gitFake({ diff: 'R090\0src/content/blog/2026/a.md\0src/content/blog/2026/b.md\0' });
  assert.throws(() => postsToAnnounce({ before: 'b1', after: 'a1', ci: true, git, log: quiet }), /a\.md/);
  assert.deepEqual(postsToAnnounce({ before: 'b1', after: 'a1', ci: false, git, log: quiet }), []);
});
