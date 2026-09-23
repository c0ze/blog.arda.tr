/** Link target for a tag: the blog listing deep-linked to that tag's filter. */
export function tagHref(tag: string): string {
  return `/blog?tag=${encodeURIComponent(tag)}`;
}

/** Estimated reading time in whole minutes (~220 wpm, min 1). */
export function readingTimeMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Ledger number for a post: its 1-based position in chronological order,
 * formatted like "№042". `index` is the position in a newest-first list. */
export function ledgerNo(index: number, total: number): string {
  return `№${String(total - index).padStart(3, '0')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateShort(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** "Jul 2026" — the tier label. */
export function monthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** "2026-07" — the tier key. */
export function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/** Reading time as a bar of ▮, one per minute, capped so a long essay reads
 * as long rather than running out of its column. */
export function minuteBars(minutes: number, cap = 12): string {
  return '▮'.repeat(Math.max(1, Math.min(cap, minutes)));
}

/** A count as a proportional ▮ bar, `width` cells at the maximum. */
export function tallyBar(count: number, max: number, width = 20): string {
  if (count <= 0 || max <= 0) return '';
  return '▮'.repeat(Math.max(1, Math.round((count / max) * width)));
}
