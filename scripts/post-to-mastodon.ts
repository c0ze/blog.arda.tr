#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import matter from 'gray-matter';
import { changedPosts, composeMastodonStatus, idempotencyKey, postSlug, postUrl } from './lib/announce.ts';

const MASTODON_URL = 'https://mastodon.world';
const ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;

async function postToMastodon(status: string, url: string) {
    if (!ACCESS_TOKEN) {
        console.warn('⚠️ MASTODON_ACCESS_TOKEN is not set.');
        console.log('Dry run mode. Would have posted:\n-------------------');
        console.log(status);
        console.log('-------------------');
        return;
    }

    try {
        const response = await fetch(`${MASTODON_URL}/api/v1/statuses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                // Mastodon drops a repeat with the same key, so a re-run of
                // the announce job does not post the same entry twice.
                'Idempotency-Key': idempotencyKey(url),
            },
            body: JSON.stringify({
                status: status,
                visibility: 'public'
            })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('❌ Failed to post to Mastodon:', response.status, text);
            process.exit(1);
        } else {
            const data = await response.json();
            console.log(`✅ Successfully posted to Mastodon! URL: ${data.url}`);
        }
    } catch (error) {
        console.error('❌ Error posting to Mastodon:', error);
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
    const url = postUrl(postSlug(filePath, parsed.data));
    const statusText = composeMastodonStatus({
        title: parsed.data.title || 'New Blog Post',
        excerpt: parsed.data.excerpt || '',
        url,
        tags: parsed.data.tags || [],
    });

    return postToMastodon(statusText, url);
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
        console.log('Skipping Mastodon post step.');
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
        console.warn('⚠️ Git diff failed. This can happen on new branches or shallow clones. Skipping Mastodon post. Details:', gitError.message);
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
