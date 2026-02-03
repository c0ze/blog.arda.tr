#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

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

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

// Get current date and year
const now = new Date();
const date = now.toISOString().split('T')[0];
const year = now.getFullYear().toString();

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
tags: ["dev"]
keywords: "keyword1, keyword2, keyword3"
description: "A brief SEO description of your post"
author: "${gitAuthor}"
image: ""
draft: false
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
