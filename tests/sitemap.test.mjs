import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';
import { sitemapItem } from '../src/lib/sitemap.mjs';

const blogDir = fileURLToPath(new URL('../src/content/blog/', import.meta.url));

async function collectPosts(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await collectPosts(path));
    else if (entry.name.endsWith('.md')) out.push(path);
  }
  return out;
}

// The sitemap's URLs had no lastmod, so crawlers could not tell a 2010 diary
// entry from last week's post. The sitemap integration's serialize hook sees
// only the URL, not the frontmatter, so a post's lastmod is read from its
// slug, /blog/YYYY-MM-DD-…/.
test('post URLs get a lastmod from the date in their slug', () => {
  assert.deepEqual(
    sitemapItem({ url: 'https://blog.arda.tr/blog/2026-10-27-dergi-coze-org/' }),
    { url: 'https://blog.arda.tr/blog/2026-10-27-dergi-coze-org/', lastmod: '2026-10-27' },
  );
  assert.equal(
    sitemapItem({ url: 'https://blog.arda.tr/blog/2010-07-30-%E6%97%A5%E5%85%89/' }).lastmod,
    '2010-07-30',
  );
});

// Pages that are not one post have no single date of their own, including
// anything nested under a post's path.
test('other pages get no lastmod', () => {
  for (const url of [
    'https://blog.arda.tr/',
    'https://blog.arda.tr/blog/',
    'https://blog.arda.tr/archive/',
    'https://blog.arda.tr/blog/2026-11-14-example/extra/',
  ]) {
    assert.deepEqual(sitemapItem({ url }), { url });
  }
});

/** A post's frontmatter date as YYYY-MM-DD. YAML reads an unquoted date as
 * a Date (UTC midnight) and a quoted one as a string. */
function frontmatterDate(source) {
  const { date } = matter(source).data;
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return typeof date === 'string' ? date.match(/^\d{4}-\d{2}-\d{2}/)?.[0] : undefined;
}

// Any date line Astro accepts must read back as the same day, or the check
// below fails the suite (and with it a deploy) on a valid post.
test('a frontmatter date reads the same however it is written', () => {
  for (const line of [
    'date: "2026-11-14"',
    "date: '2026-11-14'",
    'date: 2026-11-14',
    'date: 2026-11-14 # publication date',
    'date: "2026-11-14" # publication date',
  ]) {
    assert.equal(frontmatterDate(`---\ntitle: t\n${line}\n---\nbody\n`), '2026-11-14', line);
  }
});

// That is only the post's date because every post's filename carries its
// frontmatter date. A post whose date is edited without renaming it (or the
// other way round) would put a wrong lastmod in the sitemap: fail here first.
test('every post filename starts with its frontmatter date', async () => {
  const files = await collectPosts(blogDir);
  assert.ok(files.length > 0, 'expected to find blog posts');
  const mismatched = [];
  for (const file of files) {
    const date = frontmatterDate(await readFile(file, 'utf8'));
    const named = file.split('/').pop().slice(0, 10);
    if (date !== named) mismatched.push(`${file}: date ${date}`);
  }
  assert.deepEqual(mismatched, [], `posts whose filename and date disagree:\n${mismatched.join('\n')}`);
});

test('the sitemap integration uses it', async () => {
  const config = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  assert.match(config, /sitemap\(\{\s*serialize: sitemapItem\s*\}\)/);
});
