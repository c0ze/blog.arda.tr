/** Deterministically maps a tag to one of the five theme-accent chip classes,
 * so a given tag keeps its color everywhere (and across themes). */
const CHIP_CLASSES = ['chip-cyan', 'chip-green', 'chip-pink', 'chip-yellow', 'chip-red'];

export function tagChipClass(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) | 0;
  return `chip ${CHIP_CLASSES[Math.abs(hash) % CHIP_CLASSES.length]}`;
}

/** Link target for a tag chip: the blog listing deep-linked to that tag's filter. */
export function tagHref(tag: string): string {
  return `/blog?tag=${encodeURIComponent(tag)}`;
}

/** Estimated reading time in whole minutes (~220 wpm, min 1). */
export function readingTimeMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Ledger number for a post: its 1-based position in chronological order,
 * formatted like "№ 042". `index` is the position in a newest-first list. */
export function ledgerNo(index: number, total: number): string {
  return `№ ${String(total - index).padStart(3, '0')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateShort(date: Date): string {
  return date.toISOString().slice(0, 10);
}
