#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import matter from 'gray-matter';
import {
    credentialMode,
    isCI,
    announceRange,
    capManualAnnouncements,
    postsToAnnounce,
    composeMastodonStatus,
    idempotencyKey,
    mastodonStatusesHaveAnnouncement,
    postSlug,
    postUrl,
} from './lib/announce.ts';

const MASTODON_URL = 'https://mastodon.world';
const ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;

/**
 * Whether the account's 40 latest own top-level statuses already link this
 * post (a re-run of the announce job after a partial failure). Boosts and
 * replies are excluded server-side, since the matcher discards them anyway
 * and they would only use up the window. If the lookup fails it answers
 * false: a rare duplicate is better than a missed announcement.
 */
async function alreadyAnnounced(url: string): Promise<boolean> {
    try {
        const headers = { 'Authorization': `Bearer ${ACCESS_TOKEN}` };
        const me = await fetch(`${MASTODON_URL}/api/v1/accounts/verify_credentials`, { headers });
        if (!me.ok) throw new Error(`verify_credentials: HTTP ${me.status}`);
        const { id } = await me.json();
        const recent = await fetch(`${MASTODON_URL}/api/v1/accounts/${encodeURIComponent(id)}/statuses?limit=40&exclude_reblogs=true&exclude_replies=true`, { headers });
        if (!recent.ok) throw new Error(`statuses: HTTP ${recent.status}`);
        return mastodonStatusesHaveAnnouncement(await recent.json(), url);
    } catch (error) {
        console.warn('⚠️ Could not check for an earlier announcement; posting anyway:', error);
        return false;
    }
}

async function postToMastodon(status: string, url: string) {
    if (!ACCESS_TOKEN) {
        console.warn('⚠️ MASTODON_ACCESS_TOKEN is not set.');
        console.log('Dry run mode. Would have posted:\n-------------------');
        console.log(status);
        console.log('-------------------');
        return;
    }

    if (await alreadyAnnounced(url)) {
        console.log(`⏭️ ${url} is already announced on Mastodon; skipping.`);
        return;
    }

    try {
        const response = await fetch(`${MASTODON_URL}/api/v1/statuses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                // Mastodon drops a repeat with the same key for about an
                // hour (a retried request); later re-runs of the job are
                // caught by alreadyAnnounced().
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
        if (CI) throw new Error(`File not found: ${filePath}`);
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

const CI = isCI(process.env);

async function main() {
    // In CI a missing secret fails the step: a dry run there would be a green
    // run that announced nothing. Locally it stays a dry run.
    if (credentialMode('MASTODON_ACCESS_TOKEN', process.env) === 'fail') {
        throw new Error('MASTODON_ACCESS_TOKEN is not set; in CI that is an error, not a dry run.');
    }

    const args = process.argv.slice(2);

    // Local testing mode: specific file path provided
    if (args.length > 0) {
        const filePath = args[0];
        console.log('🚀 Running in local test mode for specific file...');
        await processFile(filePath);
        return;
    }

    // GitHub Actions mode: posts this push added, or flipped from draft to
    // published; on a manual run, posts since its announce_since input (an
    // invalid input throws before anything is posted). In CI a failed git
    // call throws instead of skipping quietly.
    console.log('🚀 Running in GitHub Actions mode...');
    const git = (gitArgs: string[]) => {
        console.log(`Executing: git ${gitArgs.join(' ')}`);
        return execFileSync('git', gitArgs, { encoding: 'utf-8' });
    };
    const { before, after, manual } = announceRange({
        eventName: process.env.GITHUB_EVENT_NAME,
        eventBefore: process.env.BEFORE_SHA,
        eventAfter: process.env.AFTER_SHA,
        head: process.env.GITHUB_SHA,
        since: process.env.ANNOUNCE_SINCE,
        git,
    });
    const posts = postsToAnnounce({ before, after, ci: CI, git });
    // A manual run selecting more than a few posts stops here, before any
    // network call: announce_since was probably too old.
    capManualAnnouncements({ manual, posts });

    if (posts.length === 0) {
        console.log('ℹ️ No blog posts to announce in this commit range.');
        return;
    }

    console.log(`Found ${posts.length} blog post(s) to announce.`);

    for (const { filePath } of posts) {
        await processFile(path.join(process.cwd(), filePath));
    }
}

main().catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exitCode = 1;
});
