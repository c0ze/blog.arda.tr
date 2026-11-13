/** JSON for a <script type="application/ld+json">: "<" escaped as \u003c so
 * no string in it can close the script element. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Link target for a post: /blog/<slug>/, the URL it is served (and canonical) at. */
export function postHref(slug: string): string {
  return `/blog/${slug}/`;
}

/** Link target for a tag: the blog listing (/blog/, its served URL) deep-linked to that tag's filter. */
export function tagHref(tag: string): string {
  return `/blog/?tag=${encodeURIComponent(tag)}`;
}

const NAMED_REFERENCES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
};

/** Whether a code point is a character XML 1.0 allows (the summary goes into rss.xml). */
const isXmlChar = (c: number) =>
  c === 0x9 || c === 0xa || c === 0xd || (c >= 0x20 && c <= 0xd7ff)
  || (c >= 0xe000 && c <= 0xfffd) || (c >= 0x10000 && c <= 0x10ffff);

/**
 * One character reference as its character. An unknown name, or a number
 * that is not an XML 1.0 character (NUL, a lone surrogate …), stays as written.
 */
function decodeReference(ref: string, name: string): string {
  if (name[0] === '#') {
    const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    return isXmlChar(code) ? String.fromCodePoint(code) : ref;
  }
  return NAMED_REFERENCES[name] ?? NAMED_REFERENCES[name.toLowerCase()] ?? ref;
}

/**
 * A meta description derived from a post body, for posts with neither
 * `description` nor `excerpt`: markdown and HTML stripped, character
 * references decoded (callers escape the result once), whitespace
 * collapsed, cut near `max` characters at a word boundary ("" when the body
 * has no text, e.g. a lone embed).
 */
export function bodyDescription(body: string | undefined, max = 155): string {
  const text = (body ?? '')
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, ' ') // fenced code
    .replace(/<(script|style|iframe|video|audio)\b[\s\S]*?<\/\1>/gi, ' ') // embeds
    .replace(/<[^>]+>/g, ' ') // other tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links keep their text
    .replace(/^\s{0,3}(#{1,6}|>+|[-*+]|\d+[.)])\s+/gm, '') // heading, quote, list markers
    .replace(/[*~`|]+/g, '') // emphasis, code, table pipes
    .replace(/(^|\W)_+|_+(?=\W|$)/g, '$1') // _emphasis_, not snake_case
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, decodeReference)
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
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
