import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');
  const sortedPosts = blog.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'Kev.in',
    description: 'It was a musical thing and you were supposed to sing.',
    site: context.site!,
    items: sortedPosts.map((post) => {
      const filename = post.id.replace('.md', '');
      const [year, month, day, ...titleParts] = filename.split('-');
      const slug = titleParts.join('-');
      const link = `/${year}/${month}/${day}/${slug}.html`;

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description || '',
        link,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
