import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const footer = await readFile(new URL('../src/components/Footer.astro', import.meta.url), 'utf8');

/** Every <a> in a source as { href, rel, text }. */
function links(source) {
  return [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, text]) => ({
    href: attrs.match(/\bhref="([^"]*)"/)?.[1],
    rel: attrs.match(/\brel="([^"]*)"/)?.[1],
    text: text.trim(),
  }));
}

// The arda.tr family links its sites to each other through each site's own
// chrome. The footer is on every page, so it names every sibling by its
// hostname. rel="me" marks only the identity pages (the landing and the
// résumé), so the profile verifiers see one person across them; ai and lind
// are sites, not identities.
test('the footer links every family site by hostname', () => {
  const family = {
    'https://arda.tr': 'me',
    'https://resume.arda.tr': 'me',
    'https://ai.arda.tr': undefined,
    'https://lind.arda.tr': undefined,
  };
  const all = links(footer);
  for (const [href, rel] of Object.entries(family)) {
    const link = all.find((l) => l.href === href);
    assert.ok(link, `footer has no link to ${href}`);
    assert.equal(link.text, new URL(href).host, `${href} is labelled by its hostname`);
    assert.equal(link.rel, rel, `${href}: rel`);
  }
});

// Only the arda.tr landing page links to coze.org; the blog's chrome must not.
test('the footer has no coze.org link', () => {
  assert.doesNotMatch(footer, /coze\.org/);
});

// The social links are verified profiles (rel="me" on Mastodon); the family
// line sits next to them and must not disturb them.
test('the footer keeps its social and feed links', () => {
  const all = links(footer);
  assert.ok(all.some((l) => l.href === 'https://mastodon.world/@arda' && l.rel === 'me'));
  assert.ok(all.some((l) => l.href === 'https://bsky.app/profile/arda-karaduman.bsky.social' && l.rel === 'me'));
  assert.ok(all.some((l) => l.href === 'https://github.com/c0ze'));
  assert.ok(all.some((l) => l.href === '/rss.xml'));
  assert.match(footer, /© \{year\} Arda Karaduman/);
});
