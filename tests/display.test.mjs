import assert from 'node:assert/strict';
import test from 'node:test';
import { postHref } from '../src/lib/display.ts';

// Posts are served as /blog/<slug>/ (canonical, sitemap and RSS all say so);
// a link without the slash costs every reader a 301 on GitHub Pages.
test('post links carry the trailing slash the canonical URL has', () => {
  assert.equal(postHref('2026-10-27-dergi-coze-org'), '/blog/2026-10-27-dergi-coze-org/');
  assert.equal(postHref('2011-07-05-new-nook-'), '/blog/2011-07-05-new-nook-/');
});
