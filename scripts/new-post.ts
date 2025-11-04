#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const title = args.join(' ');

if (!title) {
  console.error('Error: Please provide a title for your post');
  console.log('Usage: npm run new-post "Your Post Title"');
  process.exit(1);
}

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

// Get current date
const date = new Date().toISOString().split('T')[0];

// Format date for display
const displayDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Create markdown content
const content = `---
title: "${title}"
date: "${date}"
excerpt: "Add a brief description of your post here"
tags: ["tag1", "tag2"]
---

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

// Ensure content directory exists
const contentDir = path.join(process.cwd(), 'content', 'blog');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Write the file
const filename = `${slug}.md`;
const filepath = path.join(contentDir, filename);

if (fs.existsSync(filepath)) {
  console.error(`Error: A post with the slug "${slug}" already exists`);
  process.exit(1);
}

fs.writeFileSync(filepath, content);

console.log('✅ New post created successfully!');
console.log(`📄 File: content/blog/${filename}`);
console.log(`📅 Date: ${displayDate}`);
console.log(`🔗 Slug: ${slug}`);
console.log('\nEdit the file to add your content!');
