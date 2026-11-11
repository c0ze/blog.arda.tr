import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// Pagefind builds one index per <html lang> unless told otherwise, and the
// /search page (lang="en") only ever loads the English one: the Turkish and
// Japanese posts were unfindable. One forced index keeps every post in reach.
test('the search index covers every post language', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.match(pkg.scripts.build, /pagefind --site dist --force-language en\b/);
});
