#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import matter from 'gray-matter';
import { AtpAgent, RichText } from '@atproto/api';
import { changedPosts, composeBlueskyText, postSlug, postUrl } from './lib/announce.ts';

// Bluesky full handle; the app password comes from the BLUESKY_PASSWORD secret.
const BLUESKY_IDENTIFIER = 'arda-karaduman.bsky.social';
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

async function postToBluesky(status: string) {
    if (!BLUESKY_PASSWORD) {
        console.warn('⚠️ BLUESKY_PASSWORD is not set.');
        console.log('Dry run mode. Would have posted:\n-------------------');
        console.log(status);
        console.log('-------------------');
        return;
    }

    const agent = new AtpAgent({ service: 'https://bsky.social' });

    try {
        await agent.login({
            identifier: BLUESKY_IDENTIFIER,
            password: BLUESKY_PASSWORD,
        });

        const rt = new RichText({ text: status });
        await rt.detectFacets(agent); // automatically detects links and mentions

        const { uri } = await agent.post({
            text: rt.text,
            facets: rt.facets,
            createdAt: new Date().toISOString(),
        });

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

    // The URL the site serves the post at (Astro slugifies the file name).
    // The text is kept within Bluesky's 300 graphemes: excerpt first, then title.
    const url = postUrl(postSlug(filePath, parsed.data));
    const statusText = composeBlueskyText({
        title: parsed.data.title || 'New Blog Post',
        excerpt: parsed.data.excerpt || '',
        url,
        tags: parsed.data.tags || [],
    });

    return postToBluesky(statusText);
}

function getFrontmatterAtSha(sha: string, filePath: string): Record<string, any> | null {
    try {
        const content = execFileSync('git', ['show', `${sha}:${filePath}`], { encoding: 'utf-8' });
        return matter(content).data;
    } catch {
        return null;
    }
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

    let diffOutput = '';
    try {
        // Added (A) and modified (M) files between the commits. quotePath=false
        // keeps non-ASCII file names unquoted; no shell is involved.
        const diffArgs = ['-c', 'core.quotePath=false', 'diff', '--name-status', beforeSha, afterSha];
        console.log(`Executing: git ${diffArgs.join(' ')}`);
        diffOutput = execFileSync('git', diffArgs, { encoding: 'utf-8' });
    } catch (gitError: any) {
        console.warn('⚠️ Git diff failed. This can happen on new branches or shallow clones. Skipping Blue Sky post. Details:', gitError.message);
        return;
    }

    // Announce a post when this push introduced it (status A), or when the
    // push flipped it from draft to published (status M). Edits to posts
    // that were already published must not re-announce. Current drafts are
    // still filtered out by the draft check in processFile.
    const postsToAnnounce = changedPosts(diffOutput).filter(({ status, filePath }) => {
        if (status === 'A') return true;
        const before = getFrontmatterAtSha(beforeSha, filePath);
        if (before !== null && (before.draft === true || before.draft === 'true')) {
            console.log(`📢 ${filePath} was draft before this push — announcing.`);
            return true;
        }
        return false;
    });

    if (postsToAnnounce.length === 0) {
        console.log('ℹ️ No blog posts to announce in this commit range.');
        return;
    }

    console.log(`Found ${postsToAnnounce.length} blog post(s) to announce.`);

    for (const { filePath } of postsToAnnounce) {
        const fullPath = path.join(process.cwd(), filePath);
        await processFile(fullPath);
    }
}

main().catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exitCode = 1;
});
