import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { rehypeDemoteHeadings, rehypeMediaLoading, rehypeSlashPostLinks } from '../src/lib/rehype.mjs';

const publicDir = fileURLToPath(new URL('../public', import.meta.url));

const h = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const root = (...children) => ({ type: 'root', children });
const tags = (tree) => {
  const out = [];
  const walk = (n) => { for (const c of n.children ?? []) { if (c.type === 'element') out.push(c.tagName); walk(c); } };
  walk(tree);
  return out;
};

// The post title is the page's h1. A body that uses `# ` must not add more
// page-title-sized h1s, and its outline must keep its order under the title.
test('a body that opens with an h1 moves every heading down one level', () => {
  const tree = root(h('h1'), h('p'), h('h2'), h('div', {}, [h('h1'), h('h3')]), h('h6'));
  rehypeDemoteHeadings()(tree);
  assert.deepEqual(tags(tree), ['h2', 'p', 'h3', 'div', 'h2', 'h4', 'h6']);
});

// A body whose outline starts at h2 and only later uses one `# ` (the
// digital-necromancy post: twelve ##/### headings, then # THE END GAME)
// must keep its h2 start; shifting everything would open it at h3.
test('a body whose first heading is not an h1 only demotes its h1s', () => {
  const tree = root(h('h2'), h('p'), h('h3'), h('div', {}, [h('h3')]), h('h1'), h('h2'));
  rehypeDemoteHeadings()(tree);
  assert.deepEqual(tags(tree), ['h2', 'p', 'h3', 'div', 'h3', 'h2', 'h2']);
});

test('a body without an h1 is left exactly as written', () => {
  const tree = root(h('h2'), h('h3'), h('p'));
  rehypeDemoteHeadings()(tree);
  assert.deepEqual(tags(tree), ['h2', 'h3', 'p']);
});

// Body media must not compete with the page for bandwidth on load, and a
// local image must reserve its box so the column doesn't jump as it lands.
test('body images and iframes load lazily; local images get their size', async () => {
  const lead = h('p', {}, [{ type: 'text', value: 'Intro' }]);
  const local = h('img', { src: '/images/og-image.jpg' });
  const remote = h('img', { src: 'https://example.com/x.png' });
  const sized = h('img', { src: '/images/og-image.jpg', width: 300 });
  const frame = h('iframe', { src: 'https://www.youtube-nocookie.com/embed/x' });
  const tree = root(lead, h('p', {}, [local]), h('p', {}, [remote, sized]), h('div', {}, [frame]));
  await rehypeMediaLoading({ publicDir })(tree);
  assert.equal(local.properties.loading, 'lazy');
  assert.equal(local.properties.decoding, 'async');
  assert.equal(local.properties.width, 1024);
  assert.equal(local.properties.height, 1024);
  assert.equal(remote.properties.loading, 'lazy');
  assert.equal(remote.properties.width, undefined);
  assert.equal(sized.properties.width, 300, 'an author-set size is kept');
  assert.equal(frame.properties.loading, 'lazy');
});

// The book covers in digital-necromancy set only width="100": the missing
// side has to come from the file's ratio, or the box reserves no height and
// the column jumps when the lazy cover lands.
test('an image with one author-set side gets the other from the file ratio', async () => {
  const widthOnly = h('img', { src: '/images/og-image.jpg', width: 300 });
  const heightOnly = h('img', { src: '/images/og-image.jpg', height: '50' });
  const both = h('img', { src: '/images/og-image.jpg', width: 10, height: 20 });
  const relative = h('img', { src: '/images/og-image.jpg', width: '50%' });
  const remote = h('img', { src: 'https://example.com/x.png', width: 100 });
  const tree = root(h('p'), h('p', {}, [widthOnly, heightOnly, both, relative, remote]));
  await rehypeMediaLoading({ publicDir })(tree);
  assert.deepEqual([widthOnly.properties.width, widthOnly.properties.height], [300, 300]);
  assert.deepEqual([heightOnly.properties.width, heightOnly.properties.height], [50, '50']);
  assert.deepEqual([both.properties.width, both.properties.height], [10, 20], 'both sides set: left alone');
  assert.equal(relative.properties.height, undefined, 'a relative size has no pixel ratio to apply');
  assert.equal(remote.properties.height, undefined);
});

// An image that opens the body may be the largest paint on a phone; lazy
// loading it would delay the LCP, so it stays eager.
test('an image that opens the post body stays eager', async () => {
  const opener = h('img', { src: '/images/og-image.jpg' });
  const later = h('img', { src: '/images/og-image.jpg' });
  const tree = root(h('p', {}, [opener]), h('p', {}, [later]));
  await rehypeMediaLoading({ publicDir })(tree);
  assert.equal(opener.properties.loading, undefined);
  assert.equal(opener.properties.decoding, 'async');
  assert.equal(later.properties.loading, 'lazy');
});

// Posts are served at /blog/<slug>/; about 40 posts link each other as
// /blog/<slug>, and each such click cost a 301 on GitHub Pages. The links are
// fixed on the way out, so the posts stay as written.
test('in-body links to a post get the trailing slash', () => {
  const links = {
    bare: h('a', { href: '/blog/2026-02-03-digital-necromancy' }),
    hash: h('a', { href: '/blog/2026-02-03-digital-necromancy#the-loot' }),
    query: h('a', { href: '/blog/x?ref=1' }),
    slashed: h('a', { href: '/blog/2026-02-03-digital-necromancy/' }),
    listing: h('a', { href: '/blog/?tag=ai' }),
    asset: h('a', { href: '/images/x.png' }),
    external: h('a', { href: 'https://example.com/blog/x' }),
    deeper: h('a', { href: '/blog/x/y' }),
    none: h('a', {}),
  };
  rehypeSlashPostLinks()(root(h('p', {}, Object.values(links))));
  const hrefs = Object.fromEntries(Object.entries(links).map(([k, v]) => [k, v.properties.href]));
  assert.deepEqual(hrefs, {
    bare: '/blog/2026-02-03-digital-necromancy/',
    hash: '/blog/2026-02-03-digital-necromancy/#the-loot',
    query: '/blog/x/?ref=1',
    slashed: '/blog/2026-02-03-digital-necromancy/',
    listing: '/blog/?tag=ai',
    asset: '/images/x.png',
    external: 'https://example.com/blog/x',
    deeper: '/blog/x/y',
    none: undefined,
  });
});
