import rss from '@astrojs/rss';
import { statSync } from 'node:fs';
import path from 'node:path';
import { getPublishedPosts } from '@/lib/posts';

const MIME_TYPES = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
};

/**
 * Builds a valid RSS <enclosure> for an image under `public/`, or returns
 * undefined when the type is unknown or the file can't be found. RSS requires a
 * correct MIME type and a real byte length (the old code hard-coded length 0 and
 * labelled every non-PNG — including .webp — as image/jpeg).
 */
function imageEnclosure(imagePath, url) {
    const type = MIME_TYPES[path.extname(imagePath).toLowerCase()];
    if (!type) return undefined;
    try {
        const length = statSync(path.join(process.cwd(), 'public', imagePath)).size;
        return { url, length, type };
    } catch {
        return undefined;
    }
}

export async function GET(context) {
    const blog = await getPublishedPosts();
    return rss({
        title: 'Coze Blog',
        description: 'AI/LLM tooling, Go/DevOps, home networking, and generative AI music.',
        site: context.site,
        items: blog
            .map((post) => {
                const image = post.data.image;
                const description = post.data.excerpt || post.data.description;
                // Generate absolute URL for the image if it exists
                const imageURL = image ? new URL(image, context.site).href : undefined;

                // Create HTML content for description with image prepended
                const content = imageURL
                    ? `<img src="${imageURL}" style="max-width: 100%; border-radius: 8px; margin-bottom: 16px;" /><p>${description}</p>`
                    : description;

                const enclosure = image && imageURL ? imageEnclosure(image, imageURL) : undefined;

                return {
                    title: post.data.title,
                    pubDate: post.data.date,
                    description: content,
                    link: `/blog/${post.id.split('/').pop()}/`,
                    // Add enclosure for better compatibility with some readers
                    ...(enclosure && { enclosure }),
                };
            }),
        customData: `<language>en-us</language>`,
    });
}
