import type { CollectionEntry } from 'astro:content';

/**
 * Generate a blog post URL from the post's collection entry
 * Follows Jekyll's permalink format: /YYYY/MM/DD/title.html
 */
export function getBlogPostUrl(post: CollectionEntry<'blog'>): string {
  const filename = post.id.replace('.md', '');
  const [year, month, day, ...titleParts] = filename.split('-');
  const slug = titleParts.join('-');

  return `/${year}/${month}/${day}/${slug}.html`;
}

/**
 * Extract date components from a blog post filename
 */
export function getPostDateFromFilename(filename: string) {
  const [year, month, day, ...titleParts] = filename.replace('.md', '').split('-');
  return { year, month, day, slug: titleParts.join('-') };
}

/**
 * Generate pagination URL
 * Page 1 is at /, page 2+ at /pageN
 */
export function getPaginationUrl(pageNum: number): string {
  if (pageNum === 1) return '/';
  return `/page${pageNum}`;
}

/**
 * Configuration for pagination
 */
export const PAGINATION_CONFIG = {
  postsPerPage: 5,
} as const;
