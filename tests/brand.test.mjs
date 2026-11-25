import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { BRAND_FILES, CONTRACT_VERSION, compareContract } from '../scripts/lib/theme-contract.mjs';

// Kara Duman is shared as files: this site carries verbatim copies of arda.tr's
// brand files in src/brand/ and never edits them. Two things can go wrong and
// neither shows in a diff of the blog's own code: the copies drift from what
// arda.tr publishes, or the blog's stylesheet loads them in an order that lets
// a lower layer win.
const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

// Cascade layers are ordered by first appearance. The family's order must be
// stated before any rule, and the theme must load before the patterns built on
// it; the blog's own rules stay unlayered so they win over all four.
test('global.css declares the family layer order first, then loads theme and patterns', () => {
  const rules = css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  assert.match(
    rules,
    /^@layer reset, astryx-base, astryx-theme, brand;\s*@import "\.\.\/brand\/arda\.css";\s*@import "\.\.\/brand\/brand\.css";/,
  );
  const own = [...rules.matchAll(/@layer\s+([\w-]+)\s*\{/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(own)].sort(), ['astryx-base', 'reset'], 'the only layered rules stand in for Astryx');
});

// The theme's tokens are scoped to [data-astryx-theme="arda"]: without the
// attribute on <html> no colour or size resolves at all.
test('the copied theme is scoped to the attribute the layout sets', async () => {
  const theme = await readFile(new URL('../src/brand/arda.css', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  assert.match(theme, /@scope \(\[data-astryx-theme="arda"\]\)/);
  assert.match(layout, /<html lang=\{lang\} data-astryx-theme="arda"[\s>]/);
});

// The family's faces, in the weights the theme asks for. A weight that is not
// loaded is synthesised (a smeared blackletter, a faux-bold Spectral), and a
// face left over from an earlier system is a download nothing uses.
test('the layout loads the family faces, in the weights the theme uses', async () => {
  const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  const fonts = [...layout.matchAll(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/g)].map((m) => m[0]);
  const families = Object.fromEntries(fonts.flatMap((url) => [...url.matchAll(/family=([^&:]+)(?::([^&]+))?/g)].map(([, name, axes]) => [name.replace(/\+/g, ' '), axes])));
  assert.deepEqual(families, {
    'Grenze Gotisch': 'wght@700;800;900',
    'JetBrains Mono': 'wght@400;700',
    Spectral: 'ital,wght@0,400;0,600;1,400',
    'Zen Antique': undefined, // one weight: 400
  });
  for (const url of fonts) assert.match(url, /[?&]display=swap\b/, 'text shows in a fallback face while a font loads');
  assert.match(layout, /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>/);
});

// The artwork is bone lines on a transparent ground: on bone paper it would
// vanish, so it only ever sits on soot (the emblem's own ground, the wisp's
// plate). One wisp, at the top of a post; no other artwork.
test('the artwork sits on soot: the emblem in the bar, one wisp on a plate in a post', async () => {
  const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
  const header = await read('../src/components/Header.astro');
  const post = await read('../src/pages/blog/[slug].astro');
  const brand = await read('../src/brand/brand.css');
  assert.match(header, /<img class="ix-emblem" src=\{emblem\.src\} alt=""/);
  assert.match(brand, /\.ix-emblem \{[^}]*background: var\(--ix-soot\);/);
  assert.match(post, /<div class="ix-plate ix-smoke post-wisp"[^>]*>\s*<img class="ix-art ix-art--drift" data-smoke-video="\/brand\/wisp-smoke\.mp4" alt="" src=\{wisp\.src\}/);
  assert.match(brand, /\.ix-plate \{[^}]*background: var\(--ix-soot\);/);
  assert.equal(post.match(/class="ix-art[ "]/g).length, 1);
  // the plate is hidden until the right margin can hold it, and in print
  const rules = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(rules, /\.post-wisp \{\s*display: none;\s*\}\s*@media \(min-width: [\d.]+rem\) \{\s*\.post-wisp \{\s*display: block;/);
});

const sha = (text) => createHash('sha256').update(text).digest('hex');
const local = Object.fromEntries(BRAND_FILES.map((name) => [name, sha(name)]));
const published = (overrides = {}) => ({
  version: CONTRACT_VERSION,
  system: 'Kara Duman',
  files: Object.fromEntries(BRAND_FILES.map((name) => [name, { sha256: overrides[name] ?? sha(name) }])),
});

test('contract v4: copies that match the published hashes pass', () => {
  const result = compareContract(published(), local);
  assert.equal(result.ok, true);
  assert.equal(result.compared, true);
  assert.deepEqual(result.errors, []);
});

// The point of the check: an edited or stale copy must fail, and say which file.
test('contract v4: a copy that differs fails and names the file', () => {
  const result = compareContract(published({ 'brand.css': sha('newer brand.css') }), local);
  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /src\/brand\/brand\.css differs/);
});

test('contract v4: a missing copy or a missing published hash fails', () => {
  const { 'scheme.js': _dropped, ...withoutScheme } = local;
  assert.match(compareContract(published(), withoutScheme).errors[0], /src\/brand\/scheme\.js is missing/);
  const contract = published();
  delete contract.files['arda.css'];
  assert.match(compareContract(contract, local).errors[0], /no sha256 for arda\.css/);
});

// Until arda.tr merges its own rebrand its main publishes v3, which has no
// file hashes. That is not a drift: the check says so and passes, without
// claiming to have compared anything.
test('an older published contract passes with a note and compares nothing', () => {
  const result = compareContract({ version: 3, system: 'One Bit Forest', themes: [] }, local);
  assert.equal(result.ok, true);
  assert.equal(result.compared, false);
  assert.match(result.notes[0], /v3 \(One Bit Forest\)/);
});

test('a contract this check does not know fails instead of passing blind', () => {
  assert.equal(compareContract({ version: 5, files: {} }, local).ok, false);
  assert.equal(compareContract({}, local).ok, false);
});
