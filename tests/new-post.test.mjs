import assert from 'node:assert/strict';
import test from 'node:test';
import matter from 'gray-matter';
import { localDate, postFrontmatter, slugify } from '../scripts/lib/new-post.ts';

// The year folder comes from the local clock, and so must the date: in Tokyo
// a post started before 09:00 used to get yesterday's UTC date.
test('the post date is the local calendar date', () => {
  const early = new Date(2026, 0, 1, 0, 30); // 00:30 local time on Jan 1
  assert.equal(localDate(early), '2026-01-01');
  assert.equal(localDate(new Date(2026, 10, 9, 23, 59)), '2026-11-09');
});

// Turkish letters must survive as their plain Latin forms (the old slug
// turned "Dergileri Çağı" into "dergileri-a"), and a title with nothing
// slug-able (Japanese) must be reported, not written as "2026-01-01-.md".
test('titles slugify with Turkish letters transliterated', () => {
  assert.equal(slugify('Dergileri Çağı: İstanbul’da Şükür ve Öğün'), 'dergileri-cagi-istanbul-da-sukur-ve-ogun');
  assert.equal(slugify('Introducing SUDONE: Barcode Price Check!'), 'introducing-sudone-barcode-price-check');
  assert.equal(slugify('ıIiİ'), 'iiii');
  assert.equal(slugify('てにをは'), '');
});

// A `"` in the title produced invalid YAML; the title is written as a JSON
// string, which YAML reads back unchanged.
test('the frontmatter round-trips any title', () => {
  const title = 'He said "hi" \\ then: left #1';
  const fm = postFrontmatter({ title, date: '2026-11-12', author: 'A "B" C' });
  const data = matter(`${fm}\nbody`).data;
  assert.equal(data.title, title);
  assert.equal(data.author, 'A "B" C');
  assert.equal(data.date, '2026-11-12');
  assert.equal(data.draft, false);
});
