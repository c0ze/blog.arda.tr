#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import matter from 'gray-matter';
import { AtpAgent, RichText, type BlobRef } from '@atproto/api';
import {
    BLUESKY_BLOB_LIMIT,
    buildBlueskyRecord,
    buildExternalEmbed,
    blueskyFeedHasAnnouncement,
    changedPosts,
    composeBlueskyText,
    ogImageFile,
    postSlug,
    postUrl,
    thumbMimeType,
} from './lib/announce.ts';

// Bluesky full handle; the app password comes from the BLUESKY_PASSWORD secret.
const BLUESKY_IDENTIFIER = 'arda-karaduman.bsky.social';
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

interface Card {
    uri: string;
    title: string;
    description: string;
    lang: unknown;
    /** The OG image file under public/, uploaded as the card thumbnail. */
    imageFile: string | null;
}

/**
 * The link card. A thumbnail that is missing, of an unknown type, over
 * Bluesky's blob limit or fails to upload is skipped (the card still goes
 * out); any other failure returns undefined and the post goes out plain.
 */
async function buildEmbed(agent: AtpAgent, card: Card) {
    try {
        let thumb: BlobRef | undefined;
        const file = card.imageFile;
        const mimeType = file ? thumbMimeType(file) : null;
        if (file && mimeType && fs.existsSync(file)) {
            const size = fs.statSync(file).size;
            if (size <= BLUESKY_BLOB_LIMIT) {
                try {
                    const { data } = await agent.uploadBlob(fs.readFileSync(file), { encoding: mimeType });
                    thumb = data.blob;
                } catch (error) {
                    console.warn('⚠️ Thumbnail upload failed; posting the card without it:', error);
                }
            } else {
                console.warn(`⚠️ ${file} is ${size} bytes, over the ${BLUESKY_BLOB_LIMIT}-byte blob limit; card without thumbnail.`);
            }
        }
        return buildExternalEmbed({ uri: card.uri, title: card.title, description: card.description, thumb });
    } catch (error) {
        console.warn('⚠️ Could not build the link card; posting without it:', error);
        return undefined;
    }
}

/**
 * Whether the account's last 50 posts already link this post (a re-run of
 * the announce job after a partial failure). If the lookup fails it answers
 * false: a rare duplicate is better than a missed announcement.
 */
async function alreadyAnnounced(agent: AtpAgent, url: string): Promise<boolean> {
    try {
        const actor = agent.session?.did;
        if (!actor) throw new Error('no session DID after login');
        const { data } = await agent.getAuthorFeed({ actor, limit: 50 });
        return blueskyFeedHasAnnouncement(data.feed, url);
    } catch (error) {
        console.warn('⚠️ Could not check for an earlier announcement; posting anyway:', error);
        return false;
    }
}

async function postToBluesky(status: string, card: Card) {
    if (!BLUESKY_PASSWORD) {
        console.warn('⚠️ BLUESKY_PASSWORD is not set.');
        console.log('Dry run mode. Would have posted:\n-------------------');
        console.log(status);
        console.log(`(link card: ${card.uri}, thumbnail ${card.imageFile ?? 'none'}, lang ${String(card.lang)})`);
        console.log('-------------------');
        return;
    }

    const agent = new AtpAgent({ service: 'https://bsky.social' });

    try {
        await agent.login({
            identifier: BLUESKY_IDENTIFIER,
            password: BLUESKY_PASSWORD,
        });

        if (await alreadyAnnounced(agent, card.uri)) {
            console.log(`⏭️ ${card.uri} is already announced on Bluesky; skipping.`);
            return;
        }

        const rt = new RichText({ text: status });
        await rt.detectFacets(agent); // automatically detects links and mentions

        const embed = await buildEmbed(agent, card);
        const { uri } = await agent.post(buildBlueskyRecord({
            text: rt.text,
            facets: rt.facets,
            createdAt: new Date().toISOString(),
            lang: card.lang,
            embed,
        }));

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
    const title = parsed.data.title || 'New Blog Post';
    const excerpt = parsed.data.excerpt || '';
    const statusText = composeBlueskyText({ title, excerpt, url, tags: parsed.data.tags || [] });

    return postToBluesky(statusText, {
        uri: url,
        title,
        description: excerpt || parsed.data.description || '',
        lang: parsed.data.lang,
        imageFile: ogImageFile(parsed.data.image, path.join(process.cwd(), 'public')),
    });
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
