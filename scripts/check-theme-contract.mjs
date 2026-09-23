#!/usr/bin/env node
/**
 * Theme-contract check — verifies this blog's renditions against the family
 * catalogue published by c0ze/arda.tr as config/themes.json.
 *
 * Contract v3 ("One Bit Forest", DESIGN-SYSTEM.md): every site ships the same
 * four ids with the same roles; the VALUES differ per site (the blog's warm
 * night tint, its amber signal). So this checks shape, never values:
 *
 *   1. The id set in src/components/ThemeToggle.astro equals the contract's.
 *   2. Each id has the contract's role (light / hc-light / dark / hc-dark).
 *   3. Each rendition's CSS block in src/styles/global.css declares every
 *      required token (contract `requiredTokens`, plus the family baseline
 *      below). Token values are never compared.
 *
 * Older contracts (v1 Ink & Ledger, v2 arda.tr's Parts Catalogue) publish ids
 * this repo deliberately does not ship. When the published ids do not
 * intersect ours at all, the sites are on different systems for now: that is
 * reported loudly and SOFT-PASSES, rather than pinning CI red on a transition.
 * The moment arda.tr publishes v3, the checks above regain their teeth.
 *
 * Contract source:
 *   - THEMES_CONTRACT_PATH env var (a local file), if set — for local runs
 *     against a sibling checkout of arda.tr. A bad local path is a hard error.
 *   - Otherwise fetched from GitHub raw. Fetch failure or 404 is a SOFT SKIP
 *     (warning + exit 0) so CI never breaks on a network hiccup.
 *
 * Exit codes: 0 = in sync (or soft pass), 1 = drift.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTRACT_URL = 'https://raw.githubusercontent.com/c0ze/arda.tr/main/config/themes.json';
const THEME_TOGGLE = path.join(ROOT, 'src/components/ThemeToggle.astro');
const GLOBAL_CSS = path.join(ROOT, 'src/styles/global.css');

/** The family's token baseline (DESIGN-SYSTEM.md), required even if a contract omits the list. */
const BASELINE_TOKENS = ['bg', 'surface', 'fg', 'fg-2', 'rule', 'signal', 'ob-ink', 'ob-ground', 'ob-signal'];

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exitCode = 1;
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

/** The renditions ({ id, role }) listed in ThemeToggle.astro, in menu order. */
function parseRenditions(source) {
  const out = [];
  const re = /\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*role:\s*'([^']+)'/g;
  for (const m of source.matchAll(re)) out.push({ id: m[1], role: m[2] });
  return out;
}

/** Map of id -> Set of custom-property names declared in a block whose selector list names `.id`. */
function parseCssTokens(css, ids) {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = new Map(ids.map((id) => [id, new Set()]));
  for (const block of noComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = block[1].split(',').map((s) => s.trim());
    for (const id of ids) {
      if (!selectors.includes(`.${id}`)) continue;
      for (const decl of block[2].matchAll(/--([\w-]+)\s*:/g)) tokens.get(id).add(decl[1]);
    }
  }
  return tokens;
}

const contract = await loadContract();
if (contract === null) process.exit(0);

if (!Array.isArray(contract.themes)) {
  fail(`Unrecognized contract shape (version=${contract.version}); update this script.`);
  process.exit(1);
}

const [toggleSource, cssSource] = await Promise.all([
  readFile(THEME_TOGGLE, 'utf8'),
  readFile(GLOBAL_CSS, 'utf8'),
]);
const ours = parseRenditions(toggleSource);
if (ours.length === 0) {
  fail('Could not read the rendition list from ThemeToggle.astro; update parseRenditions().');
  process.exit(1);
}
const ourIds = ours.map((r) => r.id);
const contractIds = contract.themes.map((t) => t.id);

if (!contractIds.some((id) => ourIds.includes(id))) {
  console.warn(
    `⚠ Catalogue divergence (contract v${contract.version}).\n` +
      `  Upstream publishes: ${contractIds.join(', ')}\n` +
      `  This repo ships:    ${ourIds.join(', ')}  (One Bit Forest, contract v3)\n` +
      `  No shared ids, so nothing to compare. Skipping (soft pass).`
  );
  process.exit(0);
}

// ── 1. The id set ───────────────────────────────────────────────────────────
for (const id of contractIds) if (!ourIds.includes(id)) fail(`Missing rendition "${id}" (published by the contract).`);
for (const id of ourIds) if (!contractIds.includes(id)) fail(`Rendition "${id}" is not in the contract.`);

// ── 2. Roles ────────────────────────────────────────────────────────────────
for (const theme of contract.themes) {
  const role = theme.role ?? theme.kind;
  const mine = ours.find((r) => r.id === theme.id);
  if (mine && role && mine.role !== role) fail(`Role mismatch for "${theme.id}": contract "${role}", ours "${mine.role}".`);
}

// ── 3. Required tokens are declared (values are per-site and never compared) ─
const required = [...new Set([...BASELINE_TOKENS, ...(contract.requiredTokens ?? [])])];
const cssTokens = parseCssTokens(cssSource, ourIds);
for (const id of ourIds) {
  const declared = cssTokens.get(id);
  if (declared.size === 0) { fail(`No CSS block found for rendition "${id}" in global.css.`); continue; }
  const missing = required.filter((t) => !declared.has(t));
  if (missing.length) fail(`"${id}" does not declare: ${missing.map((t) => `--${t}`).join(', ')}.`);
}

if (process.exitCode === 1) {
  console.error('\nTheme contract check FAILED — see above.');
  process.exit(1);
}
console.log(
  `✓ Theme contract v${contract.version} OK: ${ourIds.length} renditions, ids and roles match; ` +
    `${required.length} required tokens declared in each.`
);
