import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createCombined, mergeResponses, startForLanguage } from '../public/pagefind-all/pagefind.js';

// Pagefind builds one index per <html lang> and a page searches only its own,
// so /search (lang="en") never found the Turkish and Japanese posts. Forcing
// a single language lost Japanese word segmentation (意味 inside a sentence
// was unfindable) and Turkish stemming. The build keeps one index per
// language and /search queries all of them through public/pagefind-all/.

test('the build keeps one index per language', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.match(pkg.scripts.build, /pagefind --site dist\b/);
  assert.doesNotMatch(pkg.scripts.build, /--force-language/);
  const page = await readFile(new URL('../src/pages/search.astro', import.meta.url), 'utf8');
  assert.match(page, /bundlePath: '\/pagefind-all\/'/);
});

function fakeDoc(lang = 'en') {
  const attrs = { lang };
  return {
    documentElement: {
      getAttribute: (k) => (k in attrs ? attrs[k] : null),
      setAttribute: (k, v) => { attrs[k] = v; },
      removeAttribute: (k) => { delete attrs[k]; },
    },
    attrs,
  };
}

// A stand-in for one pagefind.js copy: like the real one, init() reads the
// language from <html lang> synchronously, before its first await.
function fakeCopy(doc, byLang, failing = []) {
  const copy = {
    lang: null,
    opts: {},
    async options(o) { Object.assign(copy.opts, o); },
    init() { copy.lang = doc.attrs.lang; return Promise.resolve(); },
    async search() {
      if (failing.includes(copy.lang)) throw new Error('index missing');
      const results = byLang[copy.lang] ?? [];
      return { results, unfilteredResultCount: results.length, filters: {}, totalFilters: {} };
    },
    async filters() { return {}; },
    async preload() {},
  };
  return copy;
}

const result = (url, score) => ({ id: url, score, data: async () => ({ url }) });

// Pagefind reads its language from <html lang> when it initialises.
test('each copy initialises under its own language, and the page lang is restored', () => {
  const doc = fakeDoc('en');
  const ja = fakeCopy(doc, {});
  const tr = fakeCopy(doc, {});
  startForLanguage(ja, 'ja', doc);
  startForLanguage(tr, 'tr', doc);
  assert.equal(ja.lang, 'ja');
  assert.equal(tr.lang, 'tr');
  assert.equal(doc.attrs.lang, 'en');
});

test('one search covers every language index, ranked by score', async () => {
  const doc = fakeDoc('en');
  const byLang = {
    en: [result('/blog/en-a/', 2), result('/blog/en-b/', 0.5)],
    ja: [result('/blog/ja-a/', 3)],
    tr: [result('/blog/tr-a/', 1)],
  };
  const loaded = [];
  const copies = [];
  const combined = createCombined({
    load: async (lang) => { loaded.push(lang); const c = fakeCopy(doc, byLang); copies.push(c); return c; },
    fetchEntry: async () => ({ languages: { en: {}, ja: {}, tr: {} } }),
    doc,
  });
  await combined.options({ excerptLength: 30 });
  const response = await combined.search('x', {});
  assert.deepEqual(loaded, ['en', 'ja', 'tr'], 'one module copy per language');
  assert.deepEqual(copies.map((c) => c.lang), ['en', 'ja', 'tr']);
  assert.ok(copies.every((c) => c.opts.excerptLength === 30 && c.opts.basePath === '/pagefind/'), 'options reach every copy');
  assert.deepEqual(response.results.map((r) => r.id), ['/blog/ja-a/', '/blog/en-a/', '/blog/tr-a/', '/blog/en-b/']);
  assert.equal(response.unfilteredResultCount, 4);
  assert.equal(doc.attrs.lang, 'en');
});

// A broken language index must not take the other languages' results down.
test('a failing index is skipped, the others still answer', async () => {
  const merged = mergeResponses([{ results: [{ id: 'a', score: 1 }] }, null]);
  assert.deepEqual(merged.results.map((r) => r.id), ['a']);
  const doc = fakeDoc();
  const byLang = { en: [result('en', 1)], tr: [result('tr', 5)] };
  const warn = console.warn;
  console.warn = () => {};
  try {
    const combined = createCombined({
      load: async () => fakeCopy(doc, byLang, ['tr']),
      fetchEntry: async () => ({ languages: { en: {}, tr: {} } }),
      doc,
    });
    assert.deepEqual((await combined.search('x')).results.map((r) => r.id), ['en']);
  } finally {
    console.warn = warn;
  }
});

// A language whose module fails to load or initialise must not take the
// other languages down: before, one rejected import rejected the cached
// start-up promise, and every later search failed too.
test('a language that fails to load or start is skipped; the rest keep working', async () => {
  const doc = fakeDoc();
  const byLang = { en: [result('en', 1)], ja: [result('ja', 2)], tr: [result('tr', 3)] };
  const warn = console.warn;
  console.warn = () => {};
  try {
    const combined = createCombined({
      load: async (lang) => {
        if (lang === 'tr') throw new Error('import failed');
        const copy = fakeCopy(doc, byLang);
        if (lang === 'ja') copy.init = () => Promise.reject(new Error('init failed'));
        return copy;
      },
      fetchEntry: async () => ({ languages: { en: {}, ja: {}, tr: {} } }),
      doc,
    });
    assert.deepEqual((await combined.search('x')).results.map((r) => r.id), ['en']);
    assert.deepEqual((await combined.search('y')).results.map((r) => r.id), ['en'], 'later searches still work');
    assert.equal(doc.attrs.lang, 'en');
  } finally {
    console.warn = warn;
  }
});

// With nothing loaded there is nothing to search: the error reaches
// PagefindUI, which shows its normal failure instead of "no results".
test('when no language loads, search fails visibly', async () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    const combined = createCombined({
      load: async () => { throw new Error('offline'); },
      fetchEntry: async () => ({ languages: { en: {}, ja: {} } }),
      doc: fakeDoc(),
    });
    await assert.rejects(combined.search('x'), /no Pagefind index/);
  } finally {
    console.warn = warn;
  }
});
