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

// One machine-readable identity across the family: every site points its
// author and publisher at the same node, https://arda.tr/#person, and the
// blog is one node too, https://blog.arda.tr/#blog. The publisher used to be a
// Person named "Coze" (the blog's name, not a person).
const PERSON = {
  '@type': 'Person',
  '@id': 'https://arda.tr/#person',
  name: 'Arda Karaduman',
  url: 'https://arda.tr/',
};
const BLOG = { '@type': 'Blog', '@id': 'https://blog.arda.tr/#blog', name: 'Coze', url: 'https://blog.arda.tr/' };

/** A post as the content collection hands it to [slug].astro. */
async function post(path) {
  const { default: matter } = await import('gray-matter');
  const { data } = matter(await readFile(new URL(`../src/content/blog/${path}`, import.meta.url), 'utf8'));
  return { ...data, date: new Date(data.date) };
}

const page = (slug) => ({
  url: `https://blog.arda.tr/blog/${slug}/`,
  description: 'd',
  image: 'https://blog.arda.tr/images/og-image.jpg',
});

for (const [path, lang] of [
  ['2026/2026-06-06-grep-thyself-cataloging-a-25-year-career.md', 'en'], // no lang in its frontmatter
  ['2026/2026-10-27-dergi-coze-org.md', 'tr'],
  ['2026/2026-09-14-introducing-tenioha-meaning-lives-in-the-particles.md', 'ja'],
]) {
  test(`BlogPosting of a ${lang} post names its language, its author, the blog and the publisher`, async () => {
    const { blogPostingLd, jsonLd } = await import('../src/lib/display.ts');
    const data = await post(path);
    const slug = path.split('/').pop().replace(/\.md$/, '');
    const ld = JSON.parse(jsonLd(blogPostingLd(data, page(slug))));
    assert.equal(ld['@type'], 'BlogPosting');
    assert.equal(ld.headline, data.title);
    assert.equal(ld.inLanguage, lang);
    assert.deepEqual(ld.author, PERSON);
    assert.deepEqual(ld.publisher, PERSON);
    assert.deepEqual(ld.isPartOf, BLOG);
    assert.equal(ld.datePublished, data.date.toISOString());
    assert.deepEqual(ld.mainEntityOfPage, { '@type': 'WebPage', '@id': `https://blog.arda.tr/blog/${slug}/` });
    assert.equal(ld.keywords, data.keywords);
  });
}

// A post written by someone else (Gemmy, the assistant bot) keeps its own
// byline: it is not Arda, so it must not claim his @id.
test('a post by another author keeps that author', async () => {
  const { blogPostingLd } = await import('../src/lib/display.ts');
  const data = await post('2026/2026-01-25-the-awakening-of-gemmy.md');
  const ld = blogPostingLd(data, page('2026-01-25-the-awakening-of-gemmy'));
  assert.deepEqual(ld.author, { '@type': 'Person', name: data.author, url: 'https://arda.tr' });
  assert.deepEqual(ld.publisher, PERSON);
});

test('a post without an author is credited to Arda', async () => {
  const { blogPostingLd } = await import('../src/lib/display.ts');
  const ld = blogPostingLd({ title: 't', date: new Date('2010-05-10') }, page('x'));
  assert.deepEqual(ld.author, PERSON);
  assert.equal(ld.inLanguage, 'en');
});

// The helpers only count if the pages print them.
test('the post page prints the shared JSON-LD', async () => {
  const slug = await readFile(new URL('../src/pages/blog/[slug].astro', import.meta.url), 'utf8');
  assert.match(slug, /<script type="application\/ld\+json" is:inline set:html=\{jsonLd\(blogPostingLd\(/);
});
