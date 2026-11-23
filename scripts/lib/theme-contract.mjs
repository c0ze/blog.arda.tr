/**
 * The pure part of the theme-contract check (scripts/check-theme-contract.mjs).
 *
 * Contract v4 ("Kara Duman", ../DESIGN-SYSTEM.md): arda.tr publishes the sha256
 * of the family's brand files in config/themes.json. Every sibling site carries
 * verbatim copies of the ones it uses, so a copy is in sync exactly when its
 * hash equals the published one.
 */

/** The brand files this site carries, in src/brand/. (arda.js is for the React sites.) */
export const BRAND_FILES = ['arda.css', 'brand.css', 'scheme.js', 'smoke.js'];

export const CONTRACT_VERSION = 4;

/**
 * Compares the published contract with this site's copies.
 * `localHashes` maps each of BRAND_FILES to the sha256 of the copy.
 * Returns { ok, compared, notes, errors }: `ok` is false only on a real drift;
 * `compared` is false when the published contract is older and nothing was checked.
 */
export function compareContract(contract, localHashes) {
  const version = contract?.version;
  if (typeof version !== 'number') {
    return { ok: false, compared: false, notes: [], errors: [`The contract has no numeric version (got ${JSON.stringify(version)}).`] };
  }
  if (version < CONTRACT_VERSION) {
    // arda.tr's main still publishes the previous system: nothing to compare yet.
    return {
      ok: true,
      compared: false,
      notes: [
        `The published contract is v${version} (${contract.system ?? 'an older system'}); this site is on v${CONTRACT_VERSION} (Kara Duman). ` +
          'Nothing to compare until arda.tr publishes v4. Passing.',
      ],
      errors: [],
    };
  }
  if (version > CONTRACT_VERSION) {
    return { ok: false, compared: false, notes: [], errors: [`The published contract is v${version}; this check knows v${CONTRACT_VERSION}. Update scripts/lib/theme-contract.mjs.`] };
  }

  const errors = [];
  for (const name of BRAND_FILES) {
    const published = contract.files?.[name]?.sha256;
    const local = localHashes[name];
    if (!published) errors.push(`The contract publishes no sha256 for ${name}.`);
    else if (!local) errors.push(`src/brand/${name} is missing.`);
    else if (published !== local) {
      errors.push(`src/brand/${name} differs from arda.tr's brand/${name} (published ${published.slice(0, 12)}…, here ${local.slice(0, 12)}…). Copy the file again; never edit the copy.`);
    }
  }
  return {
    ok: errors.length === 0,
    compared: true,
    notes: errors.length === 0 ? [`Theme contract v${version} OK: ${BRAND_FILES.join(', ')} match arda.tr's brand files.`] : [],
    errors,
  };
}
