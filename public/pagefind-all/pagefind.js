/*
 * One search over every language index (loaded by /search as PagefindUI's
 * bundlePath, so the stock UI, excerpts and highlighting stay as they are).
 *
 * Pagefind builds one index per <html lang> (en, ja, tr) and a page only ever
 * searches the index of its own lang, so /search (lang="en") never found the
 * Japanese and Turkish posts. Forcing one language would lose Japanese word
 * segmentation and Turkish stemming. Instead this module loads one copy of
 * pagefind.js per language index (a distinct `?lang=` URL is a separate
 * module, with its own worker and WebAssembly: copies sharing one worker
 * clobber each other's language), searches them all and hands PagefindUI one
 * list ranked by score.
 *
 * Pagefind takes its language from <html lang> when it initialises (the
 * documented way to change it is to re-initialise under another lang), so
 * each copy's init() starts with the lang attribute briefly set to that
 * language, which is put back in the same task.
 *
 * Nothing runs on import; tests/search-index.test.mjs drives it with fakes.
 */

const BUNDLE = '/pagefind/';

/** One PagefindUI-shaped response from the per-language responses, best score first. */
export function mergeResponses(responses) {
  const ok = responses.filter(Boolean);
  const results = ok.flatMap((r) => r.results ?? []).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const sumCounts = (key) => {
    const out = {};
    for (const r of ok) {
      for (const [name, values] of Object.entries(r[key] ?? {})) {
        out[name] ??= {};
        for (const [value, count] of Object.entries(values)) out[name][value] = (out[name][value] ?? 0) + count;
      }
    }
    return out;
  };
  return {
    results,
    unfilteredResultCount: ok.reduce((n, r) => n + (r.unfilteredResultCount ?? r.results?.length ?? 0), 0),
    filters: sumCounts('filters'),
    totalFilters: sumCounts('totalFilters'),
    timings: ok.map((r) => r.timings).filter(Boolean),
  };
}

/**
 * Starts a pagefind.js copy's init() for `lang`: <html lang> names `lang`
 * while init() reads it (synchronously, before its first await), and is put
 * back before this returns. Returns init()'s promise.
 */
export function startForLanguage(pagefind, lang, doc) {
  const root = doc.documentElement;
  const previous = root.getAttribute('lang');
  root.setAttribute('lang', lang);
  try {
    return pagefind.init();
  } finally {
    if (previous === null) root.removeAttribute('lang');
    else root.setAttribute('lang', previous);
  }
}

export function createCombined({
  load = (lang) => import(`${BUNDLE}pagefind.js?lang=${encodeURIComponent(lang)}`),
  fetchEntry = () => fetch(BUNDLE + 'pagefind-entry.json').then((r) => r.json()),
  doc = globalThis.document,
} = {}) {
  let ready = null;
  let pending = {};

  function instances() {
    ready ??= (async () => {
      let languages = [];
      try {
        languages = Object.keys((await fetchEntry()).languages ?? {});
      } catch (error) {
        console.warn('Pagefind entry unreadable; searching the page language only.', error);
      }
      if (!languages.length) languages = [doc.documentElement.getAttribute('lang') || 'unknown'];
      const copies = await Promise.all(languages.map((lang) => load(lang)));
      await Promise.all(copies.map((copy) => copy.options({ ...pending, basePath: BUNDLE })));
      await Promise.all(copies.map((copy, i) => startForLanguage(copy, languages[i], doc)));
      return copies;
    })();
    return ready;
  }

  const each = async (fn) => {
    const settled = await Promise.allSettled((await instances()).map(fn));
    for (const s of settled) if (s.status === 'rejected') console.warn('A Pagefind language index failed:', s.reason);
    return settled.map((s) => (s.status === 'fulfilled' ? s.value : null));
  };

  return {
    async options(opts) {
      if (ready) await each((i) => i.options(opts));
      else pending = { ...pending, ...opts };
    },
    async init() { await instances(); },
    async mergeIndex(path, opts) { await each((i) => i.mergeIndex(path, opts)); },
    async preload(term, opts) { await each((i) => i.preload(term, opts)); },
    async filters() { return mergeResponses((await each((i) => i.filters())).map((f) => ({ filters: f ?? {} }))).filters; },
    async search(term, opts) { return mergeResponses(await each((i) => i.search(term, opts))); },
    async destroy() {
      if (ready) await each((i) => i.destroy?.());
      ready = null;
    },
  };
}

// The module API PagefindUI expects from `${bundlePath}pagefind.js`.
const combined = createCombined();
export const options = (opts) => combined.options(opts);
export const init = () => combined.init();
export const mergeIndex = (path, opts) => combined.mergeIndex(path, opts);
export const preload = (term, opts) => combined.preload(term, opts);
export const filters = () => combined.filters();
export const search = (term, opts) => combined.search(term, opts);
export const destroy = () => combined.destroy();
