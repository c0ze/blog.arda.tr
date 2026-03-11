#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import matter from 'gray-matter';
import { BskyAgent, RichText } from '@atproto/api';

const SITE_URL = 'https://blog.arda.tr/blog';

// Hardcoded user details
const BLUESKY_IDENTIFIER = 'arda-karaduman.bsky.social'; // Handles must be full, usually appending .bsky.social if not on custom domain. If custom domain, probably blog.arda.tr. We will try arda-karaduman.bsky.social first, then fallback to arda-karaduman in error handling if needed, but let's just test. Wait, let me fallback to arda-karaduman.
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

async function postToBluesky(status: string) {
    if (!BLUESKY_PASSWORD) {
        console.warn('⚠️ BLUESKY_PASSWORD is not set.');
        console.log('Dry run mode. Would have posted:\n-------------------');
        console.log(status);
        console.log('-------------------');
        return;
    }

    const agent = new BskyAgent({ service: 'https://bsky.social' });

    try {
        try {
            // we will first try what was explicitly asked "arda-karaduman", maybe user has it set without domain, though usually it includes ".bsky.social" or their domain. 
            await agent.login({
                identifier: 'arda-karaduman',
                password: BLUESKY_PASSWORD
            });
        } catch (e) {
            console.log("Login failed with 'arda-karaduman', trying 'arda-karaduman.bsky.social'...");
            await agent.login({
                identifier: 'arda-karaduman.bsky.social',
                password: BLUESKY_PASSWORD
            });
        }

        const rt = new RichText({ text: status });
        await rt.detectFacets(agent); // automatically detects links and mentions

        const postRecord = {
            $type: 'app.bsky.feed.post',
            text: rt.text,
            facets: rt.facets,
            createdAt: new Date().toISOString(),
        };

        const { uri, cid } = await agent.post(postRecord);

        console.log(`✅ Successfully posted to Blue Sky! URI: ${uri}`);

    } catch (error) {
        console.error('❌ Error posting to Blue Sky:', error);
        process.exit(1);
    }
}

function processFile(filePath: string) {
    console.log(`Processing file: ${filePath}`);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);

    if (parsed.data.draft === true || parsed.data.draft === 'true') {
        console.log(`⏭️ Skipping ${filePath} (draft)`);
        return;
    }

    const title = parsed.data.title || 'New Blog Post';
    const excerpt = parsed.data.excerpt || '';
    const tags = parsed.data.tags || [];

    // Extract slug - assume it's the filename without extension, matching Astro's default routing
    let slug = path.basename(filePath);
    // Remove markdown extension if present
    slug = slug.replace(/\.mdx?$/, '');

    const postUrl = `${SITE_URL}/${slug}`;

    // Format hashtags
    const hashtags = tags
        .map((tag: string) => `#${tag.replace(/[^a-zA-Z0-9_]/g, '')}`)
        .join(' ');

    const baseText = `📝 New blog post: ${title}\n\n`;
    const endText = `${postUrl}` + (hashtags ? `\n\n${hashtags}` : '');

    let finalExcerpt = excerpt;
    let statusText = '';

    // We will iteratively truncate finalExcerpt if needed
    while (true) {
        statusText = baseText + (finalExcerpt ? `${finalExcerpt}\n\n` : '') + endText;
        const rt = new RichText({ text: statusText });
        // The bsky API limit is 300 graphemes
        if (rt.graphemeLength <= 300) {
            break;
        }

        // If we still need to truncate
        if (finalExcerpt.length > 5 && finalExcerpt !== '...') {
            // Remove the '...' if it's there, cut 5 chars, add '...' back
            finalExcerpt = finalExcerpt.replace(/\.\.\.$/, '');
            finalExcerpt = finalExcerpt.substring(0, finalExcerpt.length - 5).trim() + '...';
        } else {
            // If no excerpt is left or it's just '...', just drop it
            finalExcerpt = '';
            statusText = baseText + endText;
            break;
        }
    }

    return postToBluesky(statusText);
}

async function main() {
    const args = process.argv.slice(2);

    // Local testing mode: specific file path provided
    if (args.length > 0) {
        const filePath = args[0];
        console.log('🚀 Running in local test mode for specific file...');
        await processFile(filePath);
        return;
    }

    // GitHub Actions mode
    console.log('🚀 Running in GitHub Actions mode...');
    const beforeSha = process.env.BEFORE_SHA;
    const afterSha = process.env.AFTER_SHA;

    if (!beforeSha || !afterSha) {
        console.warn('⚠️ BEFORE_SHA or AFTER_SHA are not set. Cannot determine new files.');
        console.log('Skipping Blue Sky post step.');
        return;
    }

    try {
        let diffOutput = '';
        try {
            const diffCmd = `git diff --name-status ${beforeSha} ${afterSha}`;
            console.log(`Executing: ${diffCmd}`);
            diffOutput = execSync(diffCmd, { encoding: 'utf-8' });
        } catch (gitError: any) {
            console.warn('⚠️ Git diff failed. This can happen on new branches or shallow clones. Skipping Blue Sky post. Details:', gitError.message);
            return;
        }

        const newFiles = diffOutput
            .split('\n')
            .filter(line => line.startsWith('A\t') || line.startsWith('A ')) // Added files
            .map(line => line.split('\t')[1] || line.split(' ')[1]) // Get file path
            .filter(filePath => filePath?.startsWith('src/content/blog/') && filePath?.endsWith('.md'));

        if (newFiles.length === 0) {
            console.log('ℹ️ No new blog posts found in this commit range.');
            return;
        }

        console.log(`Found ${newFiles.length} new blog post(s) to publish.`);

        for (const file of newFiles) {
            const fullPath = path.join(process.cwd(), file);
            await processFile(fullPath);
        }
    } catch (error) {
        console.error('❌ Error finding new files via Git:', error);
        process.exit(1);
    }
}

main().catch(console.error);
