import assert from 'node:assert/strict';
import test from 'node:test';
import { rehypeDemoteHeadings } from '../src/lib/rehype.mjs';

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
