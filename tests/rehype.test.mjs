import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { rehypeDemoteHeadings, rehypeMediaLoading } from '../src/lib/rehype.mjs';

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
test('a body with an h1 moves every heading down one level', () => {
  const tree = root(h('h1'), h('p'), h('h2'), h('div', {}, [h('h1'), h('h3')]), h('h6'));
  rehypeDemoteHeadings()(tree);
  assert.deepEqual(tags(tree), ['h2', 'p', 'h3', 'div', 'h2', 'h4', 'h6']);
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
  assert.equal(sized.properties.height, undefined, 'an author-set size is left alone');
  assert.equal(frame.properties.loading, 'lazy');
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
