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
    credentialMode,
    isCI,
    postsToAnnounce,
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

const CI = isCI(process.env);

async function main() {
    // In CI a missing secret fails the step: a dry run there would be a green
    // run that announced nothing. Locally it stays a dry run.
    if (credentialMode('BLUESKY_PASSWORD', process.env) === 'fail') {
        throw new Error('BLUESKY_PASSWORD is not set; in CI that is an error, not a dry run.');
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
    // published. In CI a failed git call throws instead of skipping quietly.
    console.log('🚀 Running in GitHub Actions mode...');
    const posts = postsToAnnounce({
        before: process.env.BEFORE_SHA,
        after: process.env.AFTER_SHA,
        ci: CI,
        git: (gitArgs) => {
            console.log(`Executing: git ${gitArgs.join(' ')}`);
            return execFileSync('git', gitArgs, { encoding: 'utf-8' });
        },
    });

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
