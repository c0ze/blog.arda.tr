import assert from 'node:assert/strict';
import test from 'node:test';
import { postHref } from '../src/lib/display.ts';

// Posts are served as /blog/<slug>/ (canonical, sitemap and RSS all say so);
// a link without the slash costs every reader a 301 on GitHub Pages.
test('post links carry the trailing slash the canonical URL has', () => {
  assert.equal(postHref('2026-10-27-dergi-coze-org'), '/blog/2026-10-27-dergi-coze-org/');
  assert.equal(postHref('2011-07-05-new-nook-'), '/blog/2011-07-05-new-nook-/');
});

// The listing is served at /blog/ too: /blog?tag= cost a 301 per tag click.
test('tag links go to the slash URL of the listing', async () => {
  const { tagHref } = await import('../src/lib/display.ts');
  assert.equal(tagHref('ai'), '/blog/?tag=ai');
  assert.equal(tagHref('c++ & go'), '/blog/?tag=c%2B%2B%20%26%20go');
});

// Every page is a directory (archive/index.html …), so a chrome link to
// /archive, /search or /blog takes a 301 before it lands. Guard the sources.
test('chrome links to site pages carry the trailing slash', async () => {
  const { readFile } = await import('node:fs/promises');
  const files = [
    'src/components/Header.astro',
    'src/components/TagChip.astro',
    'src/components/EntryRow.astro',
    'src/pages/index.astro',
    'src/pages/404.astro',
    'src/pages/search.astro',
    'src/pages/archive.astro',
    'src/pages/blog/index.astro',
    'src/pages/blog/[slug].astro',
  ];
  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    const bare = source.match(/(?:href=["'{`]+|href: ')\/(?:archive|search|blog)(?=["'`?#}])/g);
    assert.equal(bare, null, `${file}: ${bare}`);
  }
});

// Twenty legacy posts have neither description nor excerpt, and shipped an
// empty meta/og:description. Their body is the best summary they have.
test('a description can be derived from the post body', async () => {
  const { bodyDescription } = await import('../src/lib/display.ts');
  const body = [
    '# Heading',
    '',
    'Some **bold** text with a [link](https://example.com) and `code`.',
    '',
    '![alt text](/images/x.png)',
    '<iframe src="https://www.youtube-nocookie.com/embed/x"></iframe>',
    '',
    '```js',
    'const hidden = true;',
    '```',
    '',
    '> quoted   line',
    '- a list item',
  ].join('\n');
  assert.equal(bodyDescription(body), 'Heading Some bold text with a link and code. quoted line a list item');
  assert.equal(bodyDescription(''), '');
  assert.equal(bodyDescription('<iframe src="x"></iframe>'), '');
});

test('a long body is cut near 155 characters at a word boundary', async () => {
  const { bodyDescription } = await import('../src/lib/display.ts');
  const words = Array.from({ length: 60 }, (_, i) => `word${i}`).join(' ');
  const out = bodyDescription(words);
  assert.ok(out.length <= 156, `too long: ${out.length}`);
  assert.ok(out.endsWith('…'));
  assert.match(out, /word\d+…$/, 'cut between words, not inside one');
  // Japanese has no spaces: cut at the limit instead of returning nothing
  const ja = 'あ'.repeat(400);
  assert.equal(bodyDescription(ja), `${'あ'.repeat(155)}…`);
});

// JSON-LD is printed raw inside <script>. A title or description holding
// "</script>" would end the script early, so "<" is written as <,
// which JSON parsers read back as the same character.
test('JSON-LD never contains a raw "<"', async () => {
  const { jsonLd } = await import('../src/lib/display.ts');
  const data = { headline: 'Escaping </script><b>tags</b>' };
  const out = jsonLd(data);
  assert.doesNotMatch(out, /</);
  assert.deepEqual(JSON.parse(out), data);
});

// A post's number is its place in the whole run, oldest = 1, so a post keeps
// its number when newer ones are published; `index` counts from the newest.
test("a post's number is its chronological position", async () => {
  const { ledgerNo } = await import('../src/lib/display.ts');
  assert.equal(ledgerNo(0, 107), 107);
  assert.equal(ledgerNo(106, 107), 1);
  assert.equal(ledgerNo(65, 107), 42);
});

// The page prints that number as a roman numeral (the family's row, ../DESIGN-SYSTEM.md).
// A wrong numeral is a wrong number on a hundred pages: check the subtractive
// forms, the widest one the blog prints, and that nothing prints an empty string.
test('the number is printed as a roman numeral', async () => {
  const { roman } = await import('../src/lib/display.ts');
  const cases = { 1: 'I', 4: 'IV', 9: 'IX', 12: 'XII', 14: 'XIV', 40: 'XL', 49: 'XLIX', 88: 'LXXXVIII', 90: 'XC', 99: 'XCIX', 107: 'CVII', 400: 'CD', 1994: 'MCMXCIV', 3999: 'MMMCMXCIX' };
  for (const [n, numeral] of Object.entries(cases)) assert.equal(roman(Number(n)), numeral, n);
  assert.equal(roman(0), '0', 'no roman zero: digits');
  assert.equal(roman(4000), '4000');
});

// Blackletter names things: a post title of about six words is set in it, a
// longer one is a sentence and is set in Spectral. Japanese is never
// blackletter (the face has no kana or kanji), however short the title.
test('a long title, or a Japanese one, is not set in blackletter', async () => {
  const { TITLE_MAX, isPlainTitle } = await import('../src/lib/display.ts');
  assert.equal(isPlainTitle('Zork, Illuminated'), false);
  assert.equal(isPlainTitle('x'.repeat(TITLE_MAX)), false, 'the threshold itself is still a name');
  assert.equal(isPlainTitle('x'.repeat(TITLE_MAX + 1)), true);
  assert.equal(isPlainTitle('I put Wikipedia, Stack Overflow and the Amiga Hardware Reference Manual on my NAS, for my agents'), true);
  assert.equal(isPlainTitle('日本いろいろ', 'ja'), true);
  assert.equal(isPlainTitle('RETRO yayında', 'tr'), false, 'Turkish is Latin script: blackletter has its letters');
  assert.equal(isPlainTitle('😀'.repeat(TITLE_MAX)), false, 'counted in characters, not UTF-16 units');
});

// The row description and the post's standfirst are the author's own summary:
// the excerpt, else the meta description. A legacy post has neither and gets
// none; nothing is made up from the body.
test('a summary is the excerpt, else the description, else nothing', async () => {
  const { summary } = await import('../src/lib/display.ts');
  assert.equal(summary({ excerpt: 'An excerpt.', description: 'A description.' }), 'An excerpt.');
  assert.equal(summary({ excerpt: '', description: 'A description.' }), 'A description.');
  assert.equal(summary({ excerpt: '' }), '');
  assert.equal(summary({}), '');
});
