import rss from '@astrojs/rss';
import { statSync } from 'node:fs';
import path from 'node:path';
import { getPublishedPosts, getSlug } from '@/lib/posts';
import { postHref } from '@/lib/display';
import { feedItemDescription } from '@/lib/feed';

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
 * undefined when the type is unknown, the path escapes `public/`, or the file
 * can't be found. RSS requires a correct MIME type and a real byte length (the
 * old code hard-coded length 0 and labelled every non-PNG — including .webp — as
 * image/jpeg).
 */
function imageEnclosure(imagePath, url) {
    const type = MIME_TYPES[path.extname(imagePath).toLowerCase()];
    if (!type) return undefined;

    // Resolve within public/ and reject paths that escape it (path traversal).
    const publicDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicDir, imagePath);
    if (fullPath !== publicDir && !fullPath.startsWith(publicDir + path.sep)) {
        return undefined;
    }

    try {
        const length = statSync(fullPath).size;
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
                // Generate absolute URL for the image if it exists
                const imageURL = image ? new URL(image, context.site).href : undefined;

                // HTML description: the cover image, then the excerpt as escaped text
                const content = feedItemDescription({
                    text: post.data.excerpt || post.data.description,
                    imageURL,
                });

                const enclosure = image && imageURL ? imageEnclosure(image, imageURL) : undefined;

                return {
                    title: post.data.title,
                    pubDate: post.data.date,
                    description: content,
                    link: postHref(getSlug(post)),
                    // Add enclosure for better compatibility with some readers
                    ...(enclosure && { enclosure }),
                };
            }),
        xmlns: { atom: 'http://www.w3.org/2005/Atom' },
        customData: `<language>en-us</language><atom:link href="${new URL('rss.xml', context.site).href}" rel="self" type="application/rss+xml" />`,
    });
}
