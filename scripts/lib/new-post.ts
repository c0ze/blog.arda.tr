/**
 * Pure parts of scripts/new-post.ts (the date, the slug, the frontmatter),
 * importable by tests/new-post.test.mjs without writing a post.
 */

/** YYYY-MM-DD from the local clock (the year folder uses it too). */
export function localDate(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * A file-name slug: Turkish letters transliterated (ı/İ → i, ç ğ ö ş ü
 * lose their marks), other accents stripped, anything else non-alphanumeric
 * collapsed to "-". Returns "" when nothing is left (e.g. a Japanese title).
 */
export function slugify(title: string): string {
  return title
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** The new post's frontmatter block. Strings are JSON-quoted, which is valid YAML for any title. */
export function postFrontmatter({ title, date, author }: { title: string; date: string; author: string }): string {
  return `---
title: ${JSON.stringify(title)}
date: ${JSON.stringify(date)}
excerpt: "Add a brief description of your post here"
tags: ["dev"]
keywords: "keyword1, keyword2, keyword3"
description: "A brief SEO description of your post"
author: ${JSON.stringify(author)}
image: ""
draft: false
---
`;
}
