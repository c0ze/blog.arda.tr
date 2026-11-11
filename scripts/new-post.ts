#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { localDate, postFrontmatter, slugify } from './lib/new-post.ts';

// Get git user name for author field
let gitAuthor = '';
try {
  gitAuthor = execSync('git config user.name', { encoding: 'utf-8' }).trim();
} catch {
  gitAuthor = '';
}

const args = process.argv.slice(2);
const title = args.join(' ');

if (!title) {
  console.error('Error: Please provide a title for your post');
  console.log('Usage: npm run post "Your Post Title"');
  process.exit(1);
}

// Generate slug from title (Turkish letters transliterated)
const slug = slugify(title);
if (!slug) {
  console.error(`Error: "${title}" gives an empty file name: it has no Latin letters or digits.`);
  console.log('Pass a Latin title to name the file, then set the real title in its frontmatter.');
  process.exit(1);
}

// Current date and year, both from the local clock
const now = new Date();
const date = localDate(now);
const year = now.getFullYear().toString();

// Format date for display
const displayDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Create markdown content
const content = `${postFrontmatter({ title, date, author: gitAuthor })}
Write your post content here. You can use markdown formatting.

## Section Title

Your content...

### Subsection

More content...

## Another Section

- Bullet points
- Are supported
- Like this

1. Numbered lists
2. Also work
3. Great!
`;

// Ensure content directory exists (including year subdirectory)
const contentDir = path.join(process.cwd(), 'src', 'content', 'blog', year);
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Write the file
const filename = `${date}-${slug}.md`;
const filepath = path.join(contentDir, filename);

if (fs.existsSync(filepath)) {
  console.error(`Error: A post with the slug "${slug}" already exists for today`);
  process.exit(1);
}

fs.writeFileSync(filepath, content);

console.log('✅ New post created successfully!');
console.log(`📄 File: src/content/blog/${year}/${filename}`);
console.log(`📅 Date: ${displayDate}`);
console.log(`🔗 Slug: ${slug}`);
console.log(`👤 Author: ${gitAuthor || '(not set)'}`);
console.log('\nEdit the file to add your content!');
console.log('\nAvailable tags: dev, geek, music, metal, ai, hardware, retro');
