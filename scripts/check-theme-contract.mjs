#!/usr/bin/env node
/**
 * Theme-contract check — verifies this blog's theme implementation against the
 * canonical "Ink & Ledger" catalogue published by c0ze/arda.tr as
 * config/themes.json.
 *
 * What is checked:
 *   1. The theme menu in src/components/ThemeToggle.astro lists the canonical
 *      theme ids and names, in canonical (menu) order.
 *   2. Each theme's token values in src/styles/global.css equal the canonical
 *      tokens. Only token names present in BOTH the contract and the CSS block
 *      are compared; every mismatch is reported (theme/token/expected/actual).
 *
 * Contract source:
 *   - THEMES_CONTRACT_PATH env var (a local file), if set — for local runs
 *     against a sibling checkout of arda.tr. A bad local path is a hard error.
 *   - Otherwise fetched from GitHub raw. Fetch failure or 404 is a SOFT SKIP
 *     (warning + exit 0) so CI never breaks on a network hiccup or before the
 *     canonical file is pushed upstream.
 *
 * Exit codes: 0 = in sync (or soft skip / allowlisted drift only), 1 = drift.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTRACT_URL = 'https://raw.githubusercontent.com/c0ze/arda.tr/main/config/themes.json';
const THEME_TOGGLE = path.join(ROOT, 'src/components/ThemeToggle.astro');
const GLOBAL_CSS = path.join(ROOT, 'src/styles/global.css');

/**
 * Known, intentional divergences from the canonical catalogue, as exact
 * "themeId:token" pairs. These are reported as warnings but do not fail CI.
 *
 * Rationale: the blog's Ink & Ledger port deliberately re-tuned two themes
 * for its long-form reading surfaces rather than tracking arda.tr verbatim —
 *   - alucard (Ivory): warm paper background (40-hue instead of neutral),
 *     ink-tinted foregrounds, and darker AA-contrast accent chips.
 *   - van-helsing (Steel): brighter primary/ring and lighter muted text so
 *     links stay readable on the near-black background.
 * Remove a pair from this list once the two repos reconcile that token.
 */
const ALLOWED_DRIFT = new Set([
  // alucard: warm-paper Ivory tuning (2026-07 audit)
  'alucard:background',
  'alucard:foreground',
  'alucard:card-foreground',
  'alucard:popover-foreground',
  'alucard:primary',
  'alucard:secondary',
  'alucard:secondary-foreground',
  'alucard:muted',
  'alucard:muted-foreground',
  'alucard:accent',
  'alucard:destructive',
  'alucard:border',
  'alucard:input',
  'alucard:ring',
  'alucard:theme-cyan',
  'alucard:theme-green',
  'alucard:theme-pink',
  'alucard:theme-yellow',
  'alucard:theme-red',
  // van-helsing: brighter Steel link colors (2026-07 audit)
  'van-helsing:primary',
  'van-helsing:muted-foreground',
  'van-helsing:ring',
]);

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exitCode = 1;
}

function normalize(value) {
  return value.trim().replace(/\s+/g, ' ');
}

async function loadContract() {
  const localPath = process.env.THEMES_CONTRACT_PATH;
  if (localPath) {
    console.log(`Loading theme contract from THEMES_CONTRACT_PATH=${localPath}`);
    return JSON.parse(await readFile(localPath, 'utf8'));
  }
  console.log(`Fetching theme contract from ${CONTRACT_URL}`);
  try {
    const res = await fetch(CONTRACT_URL);
    if (!res.ok) {
      console.warn(`⚠ Contract fetch returned HTTP ${res.status}; skipping check (soft pass).`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`⚠ Contract fetch failed (${err.message}); skipping check (soft pass).`);
    return null;
  }
}

/** The theme menu entries ({ id, name }) from ThemeToggle.astro, in order. */
function parseThemeMenu(source) {
  const entries = [];
  const re = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
  for (const match of source.matchAll(re)) {
    entries.push({ id: match[1], name: match[2] });
  }
  return entries;
}

/** Map of themeId -> { token: value } parsed from global.css class blocks. */
function parseCssThemes(css, themeIds) {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = new Map(themeIds.map((id) => [id, {}]));

  for (const block of noComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = block[1].split(',').map((s) => s.trim());
    for (const id of themeIds) {
      // Exact class-selector match, so `.paper .glass` overrides don't count.
      if (!selectors.includes(`.${id}`)) continue;
      for (const decl of block[2].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
        tokens.get(id)[decl[1]] = normalize(decl[2]);
      }
    }
  }
  return tokens;
}

const contract = await loadContract();
if (contract === null) process.exit(0);

if (contract.version !== 1 || !Array.isArray(contract.themes)) {
  fail(`Unrecognized contract shape (version=${contract.version}); update this script.`);
  process.exit(1);
}

const [toggleSource, cssSource] = await Promise.all([
  readFile(THEME_TOGGLE, 'utf8'),
  readFile(GLOBAL_CSS, 'utf8'),
]);

// ── 1. Theme menu: ids, names, order ────────────────────────────────────────
const canonical = contract.themes.map(({ id, name }) => ({ id, name }));
const menu = parseThemeMenu(toggleSource);

if (menu.length !== canonical.length) {
  fail(`ThemeToggle menu lists ${menu.length} themes; contract has ${canonical.length}.`);
}
canonical.forEach((expected, i) => {
  const actual = menu[i];
  if (!actual) {
    fail(`ThemeToggle menu is missing "${expected.id}" at position ${i + 1}.`);
  } else if (actual.id !== expected.id || actual.name !== expected.name) {
    fail(
      `ThemeToggle menu position ${i + 1}: expected ${expected.id} ("${expected.name}"), ` +
        `found ${actual.id} ("${actual.name}").`
    );
  }
});

// ── 2. Token values in global.css ───────────────────────────────────────────
const cssThemes = parseCssThemes(cssSource, contract.themes.map((t) => t.id));
let compared = 0;
let allowed = 0;

for (const theme of contract.themes) {
  const cssTokens = cssThemes.get(theme.id) ?? {};
  if (Object.keys(cssTokens).length === 0) {
    fail(`No CSS block found for theme "${theme.id}" in global.css.`);
    continue;
  }
  for (const [token, expectedRaw] of Object.entries(theme.tokens)) {
    if (!(token in cssTokens)) continue; // compare only tokens present in both
    compared++;
    const expected = normalize(expectedRaw);
    const actual = cssTokens[token];
    if (actual === expected) continue;
    if (ALLOWED_DRIFT.has(`${theme.id}:${token}`)) {
      allowed++;
      console.warn(`⚠ allowed drift  ${theme.id}/--${token}: contract "${expected}" vs css "${actual}"`);
    } else {
      fail(`token mismatch  ${theme.id}/--${token}: expected "${expected}", actual "${actual}"`);
    }
  }
}

if (process.exitCode === 1) {
  console.error('\nTheme contract check FAILED — see mismatches above.');
  process.exit(1);
}
console.log(
  `✓ Theme contract OK: ${menu.length} menu entries match; ` +
    `${compared} token values compared${allowed ? ` (${allowed} allowlisted drifts)` : ''}.`
);
