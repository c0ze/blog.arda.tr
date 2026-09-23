import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

// The /blog tag filter. On phones the ~66 chips collapse behind a toggle, and
// a ?tag= deep link must still land filtered, with the active chip selected
// (the collapsed view keeps only that chip) and named on the toggle.
const source = await readFile(new URL('../src/pages/blog/index.astro', import.meta.url), 'utf8');
const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
assert.match(script, /applyFilter/, 'expected the tag filter script');

function el(attrs = {}) {
  const listeners = {};
  return {
    attrs,
    hidden: false,
    textContent: '',
    getAttribute: (name) => (name in attrs ? attrs[name] : null),
    setAttribute: (name, value) => { attrs[name] = value; },
    addEventListener: (name, callback) => { listeners[name] = callback; },
    click() { listeners.click?.(); },
  };
}

function page(search = '') {
  const chips = ['all', 'ai', 'dev'].map((tag) => el({ 'data-tag': tag, 'aria-pressed': String(tag === 'all') }));
  const rows = [el({ 'data-tags': 'ai,dev' }), el({ 'data-tags': 'dev' }), el({ 'data-tags': 'music' })];
  const list = { querySelectorAll: () => rows };
  const toggle = el({ 'aria-expanded': 'false' });
  toggle.hidden = true;
  const toggleNow = el();
  toggleNow.hidden = true;
  const ids = {
    'posts-list': list,
    'no-results': el(),
    'tag-now': el(),
    'tag-filters': el(),
    'tag-toggle': toggle,
    'tag-toggle-arrow': el(),
    'tag-toggle-now': toggleNow,
  };
  const replaced = [];
  const href = `https://blog.arda.tr/blog${search}`;
  vm.runInNewContext(script, {
    URL,
    URLSearchParams,
    window: { location: { href, search } },
    history: { replaceState: (_state, _title, url) => replaced.push(String(url)) },
    document: {
      querySelectorAll: (selector) => (selector === '#tag-filters .chip' ? chips : []),
      getElementById: (id) => ids[id] ?? null,
    },
  });
  const chip = (tag) => chips.find((c) => c.attrs['data-tag'] === tag);
  return { chip, rows, ids, replaced };
}

test('with script, the toggle shows and the chips start collapsed', () => {
  const { ids } = page();
  assert.equal(ids['tag-toggle'].hidden, false);
  assert.equal(ids['tag-filters'].attrs['data-collapsed'], 'true');
  assert.equal(ids['tag-toggle'].attrs['aria-expanded'], 'false');
  assert.equal(ids['tag-toggle-now'].hidden, true, 'no active tag, so the toggle names none');
});

test('a ?tag= deep link lands filtered, selected, and named on the toggle', () => {
  const { chip, rows, ids } = page('?tag=ai');
  assert.equal(chip('ai').attrs['aria-pressed'], 'true');
  assert.equal(chip('all').attrs['aria-pressed'], 'false');
  assert.deepEqual(rows.map((r) => r.hidden), [false, true, true]);
  assert.equal(ids['tag-toggle-now'].hidden, false);
  assert.equal(ids['tag-toggle-now'].textContent, 'ai');
  assert.equal(ids['tag-now'].textContent, 'ai');
});

test('the toggle opens the chips; picking one filters, updates the URL and collapses', () => {
  const { chip, rows, ids, replaced } = page();
  ids['tag-toggle'].click();
  assert.equal(ids['tag-filters'].attrs['data-collapsed'], 'false');
  assert.equal(ids['tag-toggle'].attrs['aria-expanded'], 'true');

  chip('dev').click();
  assert.deepEqual(rows.map((r) => r.hidden), [false, false, true]);
  assert.equal(replaced.at(-1), 'https://blog.arda.tr/blog?tag=dev');
  assert.equal(ids['tag-filters'].attrs['data-collapsed'], 'true');
  assert.equal(ids['tag-toggle-now'].textContent, 'dev');

  ids['tag-toggle'].click();
  chip('all').click();
  assert.equal(replaced.at(-1), 'https://blog.arda.tr/blog');
  assert.equal(ids['tag-toggle-now'].hidden, true);
});
