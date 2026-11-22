import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// Code blocks are highlighted with Shiki's css-variables theme, and every
// --astro-code-* variable is mapped onto a token of the family theme in
// global.css. A hard-coded theme once ignored the scheme and put comments at
// 3:1. In Kara Duman a code block is dark in both schemes (bone text on a soot
// plate), so this checks every token colour, at its dark value, against both
// plates: soot on bone paper, the raised soot on a dark page. The values come
// from the files the site ships (src/brand/arda.css, src/brand/brand.css).
const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const theme = await readFile(new URL('../src/brand/arda.css', import.meta.url), 'utf8');
const brand = await readFile(new URL('../src/brand/brand.css', import.meta.url), 'utf8');
const searchPage = await readFile(new URL('../src/pages/search.astro', import.meta.url), 'utf8');

/** The --astro-code-* map of global.css. */
function codeMap() {
  const m = css.match(/(?:^|\n)\.astro-code\s*\{([^}]*)\}/);
  assert.ok(m, 'expected an .astro-code block in global.css');
  return Object.fromEntries([...m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));
}

/** A theme token as { light, dark } hex colours (its first, root declaration). */
function token(name) {
  const m = theme.match(new RegExp(`${name}:\\s*light-dark\\((#[0-9a-fA-F]{6}),\\s*(#[0-9a-fA-F]{6})\\)`));
  assert.ok(m, `${name} is not a light-dark() hex pair in src/brand/arda.css`);
  return { light: m[1], dark: m[2] };
}

/** A brand colour that does not swap with the scheme (--ix-soot, --ix-bone). */
function brandColour(name) {
  const m = brand.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6});`));
  assert.ok(m, `${name} is not a hex colour in src/brand/brand.css`);
  return m[1];
}

const luminance = (hex) => {
  const [r, g, b] = hex.match(/[\da-f]{2}/gi).map((c) => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Every variable Shiki's css-variables theme reads (astro.config.mjs).
const SHIKI_TOKENS = [
  'foreground', 'token-constant', 'token-string', 'token-comment', 'token-keyword',
  'token-parameter', 'token-function', 'token-string-expression', 'token-punctuation', 'token-link',
];

// The premise of the check below. brand.css gives the block color-scheme: dark,
// so a light-dark() token inside it resolves to its dark value on a light page
// too. If the family ever drops that, the syntax colours would turn to their
// light (dark-on-light) values on a soot plate: unreadable.
test('a code block is dark in both schemes', () => {
  const pre = brand.match(/\.ix-prose :where\(pre\)\s*\{([^}]*)\}/)?.[1];
  assert.ok(pre, 'expected the code block rule in src/brand/brand.css');
  assert.match(pre, /color-scheme:\s*dark;/);
  assert.match(pre, /color:\s*var\(--ix-bone\);/);
});

// The plate is resolved on the prose, where the page's scheme still applies,
// and inherited by the block as a colour (a registered <color> property):
// soot on bone paper, the raised soot on a dark page.
test('the plate is soot on paper and the raised soot on a dark page', () => {
  assert.match(css, /@property --code-plate \{\s*syntax: "<color>";\s*inherits: true;/);
  assert.match(css, /\.ix-prose \{\s*--code-plate: light-dark\(var\(--ix-soot\), var\(--ix-surface\)\);/);
  assert.match(css, /\.ix-prose pre \{\s*background: var\(--code-plate\);/);
  assert.equal(codeMap()['--astro-code-background'], 'var(--code-plate)');
  assert.match(brand, /--ix-surface:\s*var\(--color-background-surface\);/);
});

test('every Shiki token colour clears 4.5:1 on the code plate in light and dark', () => {
  const map = codeMap();
  const plates = { light: brandColour('--ix-soot'), dark: token('--color-background-surface').dark };
  // a token's colour inside the (always dark) block
  const resolve = (value) => {
    const ref = value.match(/^var\((--[\w-]+)\)$/)?.[1];
    assert.ok(ref, `expected ${value} to reference a token`);
    return ref.startsWith('--ix-') ? brandColour(ref) : token(ref).dark;
  };
  for (const name of SHIKI_TOKENS) {
    const value = map[`--astro-code-${name}`];
    assert.ok(value, `--astro-code-${name} is not mapped`);
    const fg = resolve(value);
    for (const [scheme, plate] of Object.entries(plates)) {
      const ratio = contrast(fg, plate);
      assert.ok(ratio >= 4.5, `${scheme} page: ${name} is ${ratio.toFixed(2)}:1 on the code plate, needs 4.5:1`);
    }
  }
});

/** The blog's own CSS: global.css and the search page's <style>. Comments stripped. */
const ownCss = [css, searchPage.match(/<style is:global>([\s\S]*?)<\/style>/)?.[1] ?? '']
  .join('\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

// Dimming text with opacity drops it below the contrast floor (the chip
// counts once fell to 3.1:1). The theme's secondary text colour already
// is the dim tone, so no rule of the blog's should fade text.
test('no rule fades text with opacity', () => {
  const faded = [...ownCss.matchAll(/([^{}]+)\{[^}]*\bopacity:\s*0?\.\d+/g)].map((m) => m[1].trim());
  assert.deepEqual(faded, []);
});

// Both schemes, the contrast preference and the family's look all come from
// the theme's tokens. A hex colour or a px font size written here would stay
// the same in dark mode, or ignore the reader's font size.
test("the blog's own CSS uses the theme's tokens: no hex colours, no px font sizes", () => {
  assert.ok(ownCss.includes('--pagefind-ui-primary'), 'expected the search page styles to be read');
  assert.deepEqual(ownCss.match(/:[^;{}]*#[0-9a-fA-F]{3,8}\b/g), null, 'hex colours');
  assert.deepEqual(ownCss.match(/\bfont(?:-size)?\s*:[^;{}]*\b\d*\.?\d+px/g), null, 'px font sizes');
});

// Nothing on any site of the family is set below 18px (../DESIGN-SYSTEM.md).
// The theme's size tokens start there; a size the blog writes itself must too.
test('no font size the blog writes is below 18px', () => {
  const sizes = [...ownCss.matchAll(/\bfont-size\s*:([^;{}]*)/g)].flatMap(([, value]) =>
    [...value.matchAll(/(\d*\.?\d+)rem/g)].map(([, rem]) => Number(rem)));
  assert.ok(sizes.length > 0, 'expected the title sizes to be read');
  assert.deepEqual(sizes.filter((rem) => rem < 1.125), []);
});
