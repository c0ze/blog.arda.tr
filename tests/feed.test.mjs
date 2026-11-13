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
