/** JSON for a <script type="application/ld+json">: "<" escaped as \u003c so
 * no string in it can close the script element. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/* One identity across the arda.tr family: every site's JSON-LD points its
 * author and publisher at the same Person node, and every post at the Blog. */
export const OWNER = 'Arda Karaduman';
const PERSON = { '@type': 'Person', '@id': 'https://arda.tr/#person', name: OWNER, url: 'https://arda.tr/' };
const BLOG = { '@type': 'Blog', '@id': 'https://blog.arda.tr/#blog', name: 'Coze', url: 'https://blog.arda.tr/' };

interface PostingData {
  title: string;
  date: Date;
  author?: string;
  lang?: string;
  keywords?: string;
}

/** The BlogPosting node of a post page. A post by someone else (the Gemmy
 * bot post) keeps its own byline, without Arda's @id or URL. */
export function blogPostingLd(data: PostingData, page: { url: string; description?: string; image: string }) {
  const author = !data.author || data.author === OWNER
    ? PERSON
    : { '@type': 'Person', name: data.author };
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: page.description,
    datePublished: data.date.toISOString(),
    dateModified: data.date.toISOString(),
    image: page.image,
    inLanguage: data.lang ?? 'en',
    author,
    publisher: PERSON,
    isPartOf: BLOG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': page.url },
    keywords: data.keywords,
  };
}

/** The Blog node of the home page, the one every BlogPosting's isPartOf names. */
export function blogLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': BLOG['@id'],
    name: BLOG.name,
    url: BLOG.url,
    description: "Arda Karaduman's tech blog: AI tooling, Go, DevOps, and side quests.",
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      '@id': PERSON['@id'],
      name: OWNER,
      url: PERSON.url,
      sameAs: [
        'https://github.com/c0ze',
        'https://mastodon.world/@arda',
        'https://bsky.app/profile/arda-karaduman.bsky.social',
        'https://arda.tr/',
        'https://resume.arda.tr/',
      ],
    },
    publisher: { '@id': PERSON['@id'] },
  };
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
  const chars = Array.from(text); // code points: a cut never splits a surrogate pair
  if (chars.length <= max) return text;
  const cut = chars.slice(0, max).join('');
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/** Estimated reading time in whole minutes (~220 wpm, min 1). */
export function readingTimeMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** A post's number: its 1-based position in chronological order, so a post
 * keeps its number when newer ones are published. `index` is the position in
 * a newest-first list. */
export function ledgerNo(index: number, total: number): number {
  return total - index;
}

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

/** A post's number as the page prints it: a roman numeral (12 is "XII").
 * Anything that is not a whole number from 1 to 3999 is printed in digits. */
export function roman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return String(n);
  let rest = n;
  let out = '';
  for (const [value, letters] of ROMAN) {
    while (rest >= value) {
      out += letters;
      rest -= value;
    }
  }
  return out;
}

/** The longest post title, in characters, still set in blackletter.
 * Blackletter names things in about six words; a longer title is a sentence. */
export const TITLE_MAX = 48;

/** Whether a post title is set in Spectral instead of blackletter: a long
 * title, or a Japanese one (blackletter has no Japanese). */
export function isPlainTitle(title: string, lang?: string): boolean {
  return lang === 'ja' || Array.from(title.trim()).length > TITLE_MAX;
}

/** A post's one-line summary for rows and the standfirst: the excerpt, else
 * the meta description. Legacy posts have neither and print none. */
export function summary(data: { excerpt?: string; description?: string }): string {
  return (data.excerpt || data.description || '').trim();
}

export function formatDateShort(date: Date): string {
  return date.toISOString().slice(0, 10);
}
