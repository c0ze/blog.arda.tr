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
            .map((post) => ({
                title: post.data.title,
                pubDate: post.data.date,
                description: post.data.excerpt || post.data.description,
                link: `/blog/${post.id}/`,
            })),
        customData: `<language>en-us</language>`,
    });
}
