import assert from 'node:assert/strict';
import test from 'node:test';
import { byNewestFirst } from '../src/lib/order.ts';

const post = (id, date) => ({ id, data: { date: new Date(date) } });

// Ledger numbers (№) and prev/next links come from this order. Thirteen
// dates carry two to four posts, so without a tie-break the same post got a
// different number from one build to the next.
test('posts sort newest first, same-date posts by id, whatever the input order', () => {
  const posts = [
    post('2026/2026-06-20-introducing-arda', '2026-06-20'),
    post('2026/2026-06-27-the-future-of-ai', '2026-06-27'),
    post('2026/2026-06-20-introducing-sudone-barcode-price-check', '2026-06-20'),
    post('2011/2011-02-21-videocs-beta', '2011-02-21'),
  ];
  const expected = [
    '2026/2026-06-27-the-future-of-ai',
    '2026/2026-06-20-introducing-sudone-barcode-price-check',
    '2026/2026-06-20-introducing-arda',
    '2011/2011-02-21-videocs-beta',
  ];
  assert.deepEqual([...posts].sort(byNewestFirst).map((p) => p.id), expected);
  assert.deepEqual([...posts].reverse().sort(byNewestFirst).map((p) => p.id), expected);
});
