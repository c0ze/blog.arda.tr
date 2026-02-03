import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const blog = await getCollection('blog');
    return rss({
        title: 'Coze Blog',
        description: 'AI/LLM tooling, Go/DevOps, home networking, and generative AI music.',
        site: context.site,
        items: blog
            .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
            .map((post) => {
                const image = post.data.image;
                const description = post.data.excerpt || post.data.description;
                // Generate absolute URL for the image if it exists
                const imageURL = image ? new URL(image, context.site).href : undefined;

                // Create HTML content for description with image prepended
                const content = imageURL
                    ? `<img src="${imageURL}" style="max-width: 100%; border-radius: 8px; margin-bottom: 16px;" /><p>${description}</p>`
                    : description;

                return {
                    title: post.data.title,
                    pubDate: post.data.date,
                    description: content,
                    link: `/blog/${post.id.split('/').pop()}/`,
                    // Add enclosure for better compatibility with some readers
                    ...(imageURL && {
                        enclosure: {
                            url: imageURL,
                            length: 0, // Optional but good practice
                            type: imageURL.endsWith('.png') ? 'image/png' : 'image/jpeg',
                        },
                    }),
                };
            }),
        customData: `<language>en-us</language>`,
    });
}
