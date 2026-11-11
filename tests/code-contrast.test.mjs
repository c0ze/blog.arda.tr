import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// Code blocks are highlighted with Shiki's css-variables theme, and every
// --astro-code-* variable is mapped onto a rendition token in global.css. A
// hard-coded theme ignored the renditions and put comments at 3:1; this
// checks every token colour against the code background in all four.
const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function block(selector) {
  const m = css.match(new RegExp(`(?:^|\\n)${selector.replace(/[.]/g, '\\.')}\\s*\\{([^}]*)\\}`));
  assert.ok(m, `expected a ${selector} block in global.css`);
  return Object.fromEntries([...m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));
}

const renditions = {
  night: { tokens: block(':root,\n.night'), min: 4.5 },
  'night-hc': { tokens: block('.night-hc'), min: 7 },
  xerox: { tokens: block('.xerox'), min: 4.5 },
  'xerox-hc': { tokens: block('.xerox-hc'), min: 7 },
};

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

const SHIKI_TOKENS = [
  'foreground', 'token-constant', 'token-string', 'token-comment', 'token-keyword',
  'token-parameter', 'token-function', 'token-string-expression', 'token-link',
];

test('every Shiki token colour follows the rendition at its contrast floor', () => {
  const map = block('.astro-code');
  const resolve = (tokens, value) => {
    const ref = value.match(/^var\((--[\w-]+)\)$/);
    assert.ok(ref, `expected ${value} to reference a rendition token`);
    assert.ok(tokens[ref[1]], `${ref[1]} is not a rendition token`);
    return tokens[ref[1]];
  };
  for (const [id, { tokens, min }] of Object.entries(renditions)) {
    const bg = resolve(tokens, map['--astro-code-background']);
    for (const name of SHIKI_TOKENS) {
      const value = map[`--astro-code-${name}`];
      assert.ok(value, `--astro-code-${name} is not mapped`);
      const ratio = contrast(resolve(tokens, value), bg);
      assert.ok(ratio >= min, `${id}: ${name} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
    }
  }
});
