import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';

const blogDir = fileURLToPath(new URL('../src/content/blog/', import.meta.url));
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

async function collectPosts(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await collectPosts(path));
    else if (entry.name.endsWith('.md')) out.push(path);
  }
  return out;
}

function frontmatter(source) {
  const block = source.match(/^---\n([\s\S]*?)\n---/);
  if (!block) return {};
  const field = (name) => {
    const m = block[1].match(new RegExp(`^${name}:\\s*["']?([^"']*?)["']?\\s*$`, 'm'));
    return m ? m[1] : undefined;
  };
  return { image: field('image'), draft: field('draft') };
}

// Social crawlers fetch a post's og:image when the announce post goes out and
// cache failures for a long time, so a published post must never reference an
// image that is not in public/ yet. Drafts are exempt: they are neither
// announced nor built, and their artwork often lands in a later commit.
test('published posts reference OG images that exist in public/', async () => {
  const files = await collectPosts(blogDir);
  assert.ok(files.length > 0, 'expected to find blog posts');
  const missing = [];
  for (const file of files) {
    const { image, draft } = frontmatter(await readFile(file, 'utf8'));
    if (draft === 'true' || !image || /^https?:\/\//.test(image)) continue;
    if (!existsSync(join(publicDir, image))) {
      missing.push(`${file} -> ${image}`);
    }
  }
  assert.deepEqual(missing, [], `published posts with missing OG images:\n${missing.join('\n')}`);
});
