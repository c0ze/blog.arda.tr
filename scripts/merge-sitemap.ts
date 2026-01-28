#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const sitemap0 = path.join(distDir, 'sitemap-0.xml');
const sitemapIndex = path.join(distDir, 'sitemap-index.xml');
const sitemapFinal = path.join(distDir, 'sitemap.xml');

// Read sitemap-0.xml and rename it to sitemap.xml
if (fs.existsSync(sitemap0)) {
  const content = fs.readFileSync(sitemap0, 'utf-8');
  fs.writeFileSync(sitemapFinal, content);

  // Remove the old files
  fs.unlinkSync(sitemap0);
  if (fs.existsSync(sitemapIndex)) {
    fs.unlinkSync(sitemapIndex);
  }

  console.log('✅ Sitemap merged to sitemap.xml');
} else {
  console.error('❌ sitemap-0.xml not found');
  process.exit(1);
}
