#!/usr/bin/env node
/**
 * Theme-contract check: are this blog's copies of the family's brand files the
 * ones arda.tr publishes?
 *
 * Kara Duman (../DESIGN-SYSTEM.md) is shared as files: arda.css (the built
 * Astryx theme), brand.css (the ix- patterns) and scheme.js (the scheme
 * switch). arda.tr owns them in brand/ and publishes their sha256 in
 * config/themes.json (contract v4). This site carries verbatim copies in
 * src/brand/, so the check is a hash comparison (scripts/lib/theme-contract.mjs):
 *
 *   - contract v4: every copy's sha256 must equal files[name].sha256. A
 *     mismatch fails: copy the file again from arda.tr, never edit it here.
 *   - contract below v4: arda.tr's main still publishes the previous system.
 *     Nothing to compare; prints a note and passes.
 *
 * Contract source:
 *   - THEMES_CONTRACT_PATH env var (a local file), if set, for a run against a
 *     sibling checkout of arda.tr. A bad local path is a hard error.
 *   - Otherwise fetched from GitHub raw. A fetch failure or a non-200 answer is
 *     a soft skip (warning, exit 0) so CI never breaks on a network hiccup.
 *
 * Exit codes: 0 = in sync (or nothing to compare), 1 = drift.
 */

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { BRAND_FILES, compareContract } from './lib/theme-contract.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRAND_DIR = path.join(ROOT, 'src/brand');
const CONTRACT_URL = 'https://raw.githubusercontent.com/c0ze/arda.tr/main/config/themes.json';

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

/** sha256 of each brand copy; a missing file is left out and reported by the comparison. */
async function hashCopies() {
  const hashes = {};
  for (const name of BRAND_FILES) {
    try {
      hashes[name] = createHash('sha256').update(await readFile(path.join(BRAND_DIR, name))).digest('hex');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }
  return hashes;
}

const contract = await loadContract();
if (contract === null) process.exit(0);

const { ok, compared, notes, errors } = compareContract(contract, await hashCopies());
for (const note of notes) console.log(compared ? `✓ ${note}` : `Note: ${note}`);
for (const error of errors) console.error(`✖ ${error}`);
if (!ok) {
  console.error('\nTheme contract check FAILED: see above.');
  process.exit(1);
}
