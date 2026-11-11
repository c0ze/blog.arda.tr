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

// git quotes non-ASCII paths unless core.quotePath=false, and a quoted path
// never matched src/content/blog/, so those posts were never announced.
test('pushed posts are read from name-status output, non-ASCII names included', () => {
  const out = [
    'A\tsrc/content/blog/2011/2011-02-19-日本いろいろ.md',
    'M\tsrc/content/blog/2026/2026-10-27-dergi-coze-org.md',
    'D\tsrc/content/blog/2010/2010-05-10-les-claypool.md',
    'A\tpublic/images/x.png',
    'R100\tsrc/content/blog/a.md\tsrc/content/blog/b.md',
    '',
  ].join('\n');
  assert.deepEqual(changedPosts(out), [
    { status: 'A', filePath: 'src/content/blog/2011/2011-02-19-日本いろいろ.md' },
    { status: 'M', filePath: 'src/content/blog/2026/2026-10-27-dergi-coze-org.md' },
  ]);
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
