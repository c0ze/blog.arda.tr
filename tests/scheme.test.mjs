import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { bootSnippet } from '../src/brand/scheme.js';

// The colour scheme: the blog is bone paper (light) unless the visitor pinned
// dark (../DESIGN-SYSTEM.md, "Four sites"). The mechanism is the family's
// scheme.js (a verbatim copy in src/brand/); what the blog owns is the wiring,
// and that is what these check: the pre-paint snippet in the layout, the
// localStorage key and the default, the switch in the bar and the click
// handler in site.js.
const KEY = 'theme'; // the key the blog has always stored its theme under
const DEFAULT = 'light'; // what the page shows with nothing pinned

const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
const header = await readFile(new URL('../src/components/Header.astro', import.meta.url), 'utf8');

// The scheme must be on <html> before first paint, or a visitor who pinned
// dark gets a flash of the light page on every load (and one on a dark system
// a flash of the dark page). The snippet has to run right after the
// color-scheme meta it rewrites, and inline. The browser's own UI colour is
// the paper's: bone.
test('the layout inlines the boot snippet right after the color-scheme meta', () => {
  assert.match(layout, /<html[^>]*\sdata-astryx-theme="arda"/, 'the theme scope is on <html>');
  assert.match(
    layout,
    /<meta name="color-scheme" content="light dark" \/>\s*<script is:inline set:html=\{bootSnippet\('theme', 'light'\)\} \/>/,
  );
  assert.match(layout, /<meta name="theme-color" content="#E8E0CE" \/>/);
});

// The layout's snippet and site.js must agree on the key and the default, or
// the switch would toggle against a page the snippet painted differently.
test('site.js uses the same key and default as the layout', async () => {
  const script = await readFile(new URL('../src/scripts/site.js', import.meta.url), 'utf8');
  assert.match(script, /const SCHEME_KEY = 'theme';/);
  assert.match(script, /const SCHEME_DEFAULT = 'light';/);
});

/** Runs the pre-paint snippet against a fake page; returns what it left behind. */
function boot({ stored = null, blocked = false } = {}) {
  let theme = null;
  let metaContent = 'light dark';
  const writes = [];
  vm.runInNewContext(bootSnippet(KEY, DEFAULT), {
    localStorage: {
      getItem() { if (blocked) throw new Error('Storage blocked'); return stored; },
      setItem(_key, value) { stored = value; writes.push(value); },
      removeItem() { stored = null; writes.push(null); },
    },
    document: {
      documentElement: { setAttribute: (_name, value) => { theme = value; } },
      querySelector: () => ({ setAttribute: (_name, value) => { metaContent = value; } }),
    },
  });
  return { theme, metaContent, stored, writes };
}

// A returning visitor still carries a rendition id of One Bit Forest (or of a
// system before it). They chose light or dark on purpose: they must land on
// the scheme with the same role, and the stored id is rewritten once.
test('a stored rendition id of the old system lands on the scheme with its role', () => {
  for (const [old, scheme] of [
    ['night', 'dark'], ['night-hc', 'dark'], ['xerox', 'light'], ['xerox-hc', 'light'],
    ['carbon', 'dark'], ['dracula', 'dark'], ['alucard', 'light'], ['paper', 'light'],
  ]) {
    const page = boot({ stored: old });
    assert.equal(page.theme, scheme, `${old} shows ${scheme}`);
    assert.equal(page.metaContent, scheme, `${old}: the browser's own UI follows`);
    assert.equal(page.stored, scheme, `${old} is rewritten to ${scheme}`);
  }
});

test('a pinned scheme is applied as it is; with nothing stored the page is light', () => {
  assert.equal(boot({ stored: 'dark' }).theme, 'dark');
  assert.deepEqual(boot({ stored: 'dark' }).writes, [], 'a current value is not rewritten');
  const unpinned = boot();
  assert.equal(unpinned.theme, 'light', 'bone paper, whatever the system prefers');
  assert.equal(unpinned.metaContent, 'light', "the browser's own UI follows");
  assert.deepEqual(unpinned.writes, [], 'the default is not stored as a pin');
});

// A value no system ever stored must not pin anything, and must not stay.
test('an unknown stored value is dropped', () => {
  const page = boot({ stored: 'sepia' });
  assert.equal(page.theme, 'light');
  assert.equal(page.stored, null);
});

test('the page still loads, light, when browser storage is blocked', () => {
  const page = boot({ blocked: true });
  assert.equal(page.theme, 'light');
  assert.equal(page.metaContent, 'light');
});

// The switch names the scheme it switches to. Both labels are in the markup
// and brand.css shows one, so the control is right before any script runs and
// without script at all; a real <button>, so it works from the keyboard.
test('the scheme switch is a button that carries both labels', () => {
  const button = header.match(/<button\b[^>]*\bdata-scheme-toggle[^>]*>([\s\S]*?)<\/button>/);
  assert.ok(button, 'expected the scheme switch in the bar');
  assert.match(button[0], /^<button type="button" class="[^"]*\bix-scheme\b/);
  const label = (when) => button[1].match(new RegExp(`data-when="${when}">([\\s\\S]*?)</span></span>`))?.[1].replace(/<[^>]+>/g, '');
  assert.equal(label('light'), 'Switch to dark scheme', 'on a light page it offers dark');
  assert.equal(label('dark'), 'Switch to light scheme', 'on a dark page it offers light');
});

/**
 * Loads src/scripts/site.js against a fake page and returns its handles.
 * `system` is what prefers-color-scheme reports.
 */
async function site({ system = 'light', blocked = false } = {}) {
  // keyed like the real thing: a pin written under another key is not the blog's pin
  const store = new Map();
  const attrs = {};
  let metaContent = 'light dark';
  const listeners = { document: {}, window: {} };
  const button = { addEventListener(_name, callback) { this.click = callback; } };
  const clicked = [];
  const links = { a: { click: () => clicked.push('a') }, '/': { click: () => clicked.push('/') } };
  const fake = {
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Storage blocked'); return store.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Storage blocked'); store.set(key, value); },
      removeItem(key) { if (blocked) throw new Error('Storage blocked'); store.delete(key); },
    },
    matchMedia: () => ({ matches: system === 'dark' }),
    HTMLElement: class {},
    CSS: { escape: (value) => value },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    window: { addEventListener: (name, callback) => { listeners.window[name] = callback; }, removeEventListener() {} },
    document: {
      documentElement: {
        setAttribute: (name, value) => { attrs[name] = value; },
        removeAttribute: (name) => { delete attrs[name]; },
      },
      querySelector: (selector) => {
        if (selector === 'meta[name="color-scheme"]') return { setAttribute: (_name, value) => { metaContent = value; } };
        const key = selector.match(/^a\[data-key="(.*)"\]$/)?.[1];
        return key ? links[key] ?? null : null;
      },
      querySelectorAll: (selector) => (selector === '[data-scheme-toggle]' ? [button] : []),
      addEventListener: (name, callback) => { listeners.document[name] = callback; },
      dispatchEvent() {},
    },
  };
  // The module and its handlers read these as globals, so they stay in place
  // until the test ends (restore). Descriptors, because some are accessors in Node.
  const saved = {};
  for (const [name, value] of Object.entries(fake)) {
    saved[name] = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  }
  const restore = () => {
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  };
  // a fresh copy per test: the module wires the page when it loads
  await import(`../src/scripts/site.js?${Math.random()}`);
  return { button, attrs, listeners, clicked, restore, store, stored: () => store.get(KEY) ?? null, meta: () => metaContent, HTMLElement: fake.HTMLElement };
}

// "It is too bright right now": the switch goes to the opposite of what is on
// screen. Dark is a pin; going back to light is going back to the blog's
// default, so the pin is cleared instead of storing "light".
test('the switch pins dark, and clears the pin on the way back to light', async (t) => {
  const page = await site({ system: 'light' });
  t.after(page.restore);
  page.button.click();
  assert.equal(page.stored(), 'dark');
  assert.equal(page.attrs['data-theme'], 'dark');
  assert.equal(page.meta(), 'dark');
  page.button.click();
  assert.equal(page.stored(), null, 'light is the default: no pin is kept');
  assert.equal(page.attrs['data-theme'], 'light');
  assert.equal(page.meta(), 'light');
});

// The system's scheme does not decide here: on a dark system the page is
// still bone paper, so the first click must go to dark, not to light.
test('on a dark system the page is still light, and the switch pins dark', async (t) => {
  const page = await site({ system: 'dark' });
  t.after(page.restore);
  page.button.click();
  assert.equal(page.stored(), 'dark');
  assert.equal(page.attrs['data-theme'], 'dark');
});

test('the switch still works when browser storage is blocked', async (t) => {
  const page = await site({ system: 'light', blocked: true });
  t.after(page.restore);
  page.button.click();
  assert.equal(page.attrs['data-theme'], 'dark', 'applied, though it cannot persist');
});

// A pin set in another tab reaches this one, so two open tabs never disagree.
test('a pin changed in another tab is applied here', async (t) => {
  const page = await site({ system: 'light' });
  t.after(page.restore);
  page.store.set(KEY, 'dark');
  page.listeners.window.storage({ key: KEY });
  assert.equal(page.attrs['data-theme'], 'dark');
  page.store.delete(KEY);
  page.listeners.window.storage({ key: KEY });
  assert.equal(page.attrs['data-theme'], 'light', 'unpinned there: back to the default here');
});

// The single-key shortcuts (a archive, / search …) follow the link that
// carries the key, and must never fire while the visitor types in a field
// (the search box) or holds a modifier (Ctrl+A).
test('a single key follows its link, except while typing or with a modifier', async (t) => {
  const page = await site();
  t.after(page.restore);
  const press = (key, extra = {}) => {
    let prevented = false;
    page.listeners.document.keydown({ key, target: {}, preventDefault: () => { prevented = true; }, ...extra });
    return prevented;
  };
  assert.equal(press('a'), true);
  assert.deepEqual(page.clicked, ['a']);
  assert.equal(press('x'), false, 'a key with no link is left to the browser');
  const input = Object.assign(new page.HTMLElement(), { tagName: 'INPUT', isContentEditable: false });
  press('/', { target: input });
  press('a', { ctrlKey: true });
  assert.deepEqual(page.clicked, ['a'], 'typing and Ctrl+A follow no link');
});
