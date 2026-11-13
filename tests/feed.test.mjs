import assert from 'node:assert/strict';
import test from 'node:test';
import { feedItemDescription } from '../src/lib/feed.ts';

// The item description is HTML. An excerpt is plain text, so it must be
// escaped before it goes in (an `<` or `&` in an excerpt broke the markup),
// and a post without one must not print "<p>undefined</p>".
test('the excerpt is escaped into the item HTML', () => {
  const html = feedItemDescription({ text: 'Tom & Jerry <script>', imageURL: 'https://blog.arda.tr/images/a.png' });
  assert.equal(html, '<img src="https://blog.arda.tr/images/a.png" alt="" style="max-width: 100%; margin-bottom: 16px;" /><p>Tom &amp; Jerry &lt;script&gt;</p>');
  assert.doesNotMatch(html, /border-radius/, 'the system has no radius, the feed neither');
});

test('an empty excerpt leaves no empty or undefined paragraph', () => {
  assert.equal(
    feedItemDescription({ text: '', imageURL: 'https://blog.arda.tr/images/a.png' }),
    '<img src="https://blog.arda.tr/images/a.png" alt="" style="max-width: 100%; margin-bottom: 16px;" />',
  );
  assert.equal(feedItemDescription({ text: undefined }), undefined);
  assert.equal(feedItemDescription({ text: 'a < b' }), 'a &lt; b');
});

// Twenty legacy posts have neither excerpt nor description, and their RSS
// items shipped without any <description>. They get the same body-derived
// summary as their pages' meta description.
test('an item without excerpt or description is summarised from its body', async () => {
  const { feedItemText } = await import('../src/lib/feed.ts');
  assert.equal(feedItemText({ excerpt: 'E', description: 'D' }, 'body'), 'E');
  assert.equal(feedItemText({ excerpt: '', description: 'D' }, 'body'), 'D');
  assert.equal(feedItemText({ excerpt: '' }, 'Some **bold** body & more.'), 'Some bold body & more.');
  assert.equal(feedItemText({}, '<iframe src="x"></iframe>'), '', 'a lone embed has no text');
  assert.equal(
    feedItemDescription({ text: feedItemText({}, 'Tom & Jerry') }),
    'Tom &amp; Jerry',
  );
});

// A body that writes a character reference (`Tom &amp; Jerry`) must read as
// the character in the summary; escaping the raw reference again showed a
// literal "&amp;" in the feed reader and in the page's meta description.
test('character references in a body are decoded before escaping', async () => {
  const { feedItemText } = await import('../src/lib/feed.ts');
  const { bodyDescription } = await import('../src/lib/display.ts');
  assert.equal(bodyDescription('Tom &amp; Jerry &lt;3 &quot;cats&quot; &#39;n&#x27; mice&nbsp;&hellip;'), 'Tom & Jerry <3 "cats" \'n\' mice …');
  assert.equal(feedItemDescription({ text: feedItemText({}, 'Tom &amp; Jerry &lt;b&gt;') }), 'Tom &amp; Jerry &lt;b&gt;');
  assert.equal(bodyDescription('&unknownref; stays'), '&unknownref; stays');
});

// The summary goes into rss.xml. A numeric reference to a character XML 1.0
// does not allow (NUL, a lone surrogate) would make the feed unparseable, so
// it stays as written (and is escaped as text); valid ones decode.
test('numeric references decode only to valid XML characters', async () => {
  const { bodyDescription } = await import('../src/lib/display.ts');
  assert.equal(bodyDescription('a&#0;b'), 'a&#0;b');
  assert.equal(bodyDescription('a&#xD800;b'), 'a&#xD800;b');
  assert.equal(bodyDescription('a&#xFFFE;b &#x1;'), 'a&#xFFFE;b &#x1;');
  assert.equal(bodyDescription('a&#x110000;b'), 'a&#x110000;b');
  assert.equal(bodyDescription('smile &#x1F600; tab&#9;x'), 'smile 😀 tab x');
  assert.equal(bodyDescription('Tom &#38; Jerry'), 'Tom & Jerry');
  assert.equal(feedItemDescription({ text: bodyDescription('a&#0;b') }), 'a&amp;#0;b');
});

// The cut near 155 characters must not split a surrogate pair: half an
// emoji is not a character, and as a lone surrogate it is not valid XML.
test('a long summary is cut on code points, never inside an emoji', async () => {
  const { bodyDescription } = await import('../src/lib/display.ts');
  const out = bodyDescription(`${'x'.repeat(154)}&#x1F600;${'y'.repeat(20)}`);
  assert.equal(out, `${'x'.repeat(154)}😀…`);
  assert.doesNotMatch(out, /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/);
});
