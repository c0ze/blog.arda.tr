import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_CARD_IMAGE, recentSlides } from '../src/lib/display.ts';
import { nearestSlide } from '../src/scripts/carousel.js';

const entry = (n, data = {}) => ({
  slug: `2026-11-${String(n).padStart(2, '0')}-post`,
  date: new Date(Date.UTC(2026, 10, n)),
  post: { data: { title: `Post ${n}`, excerpt: `About ${n}.`, image: `/images/og/${n}.png`, lang: 'en', ...data } },
});

// The home page shows what is new, not the archive: five slides at most, in
// the ledger's order (newest first).
test('the carousel takes the five newest posts, in order', () => {
  const slides = recentSlides([9, 8, 7, 6, 5, 4, 3].map((n) => entry(n)));
  assert.deepEqual(slides.map((s) => s.title), ['Post 9', 'Post 8', 'Post 7', 'Post 6', 'Post 5']);
  assert.equal(recentSlides([entry(1), entry(2)]).length, 2);
});

// Every slide draws an image and a snippet, so a post without a card image
// gets the blog's, and the snippet falls back to the meta description.
test('a slide always has an image; its snippet is the excerpt, else the description', () => {
  const [bare, described] = recentSlides([
    entry(1, { image: undefined, excerpt: '' }),
    entry(2, { excerpt: '', description: 'From the description.' }),
  ]);
  assert.equal(bare.image, DEFAULT_CARD_IMAGE);
  assert.equal(bare.snippet, '');
  assert.equal(described.snippet, 'From the description.');
  assert.equal(described.image, '/images/og/2.png');
});

// lang goes on the title and snippet only when the post is not in English.
test('a slide carries its language only when it is not English', () => {
  const [en, tr] = recentSlides([entry(1), entry(2, { lang: 'tr' })]);
  assert.equal(en.lang, undefined);
  assert.equal(tr.lang, 'tr');
});

// The buttons and markers work from where the track really is, not from a
// counter that could drift from it.
test('the current slide is the one nearest the centre of the track', () => {
  const centers = [360, 1104, 1848];
  assert.equal(nearestSlide(centers, 360), 0);
  assert.equal(nearestSlide(centers, 800), 1);
  assert.equal(nearestSlide(centers, 5000), 2);
});
