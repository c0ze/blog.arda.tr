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
