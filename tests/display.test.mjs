import assert from 'node:assert/strict';
import test from 'node:test';
import { postHref } from '../src/lib/display.ts';

// Posts are served as /blog/<slug>/ (canonical, sitemap and RSS all say so);
// a link without the slash costs every reader a 301 on GitHub Pages.
test('post links carry the trailing slash the canonical URL has', () => {
  assert.equal(postHref('2026-10-27-dergi-coze-org'), '/blog/2026-10-27-dergi-coze-org/');
  assert.equal(postHref('2011-07-05-new-nook-'), '/blog/2011-07-05-new-nook-/');
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
