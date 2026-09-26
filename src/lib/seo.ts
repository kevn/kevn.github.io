import type { Metadata } from 'next'
import { site } from './site'

const FEED = { 'application/rss+xml': [{ url: '/feed.xml', title: site.name }] }

/** Where a page's Markdown twin lives. */
export const markdownPath = (path: string) => (path === '/' ? '/index.md' : `${path}.md`)

/**
 * Per-page metadata. Next replaces (not merges) `alternates` and `openGraph`
 * between layout and page, so every page gets the full set here: its own
 * canonical + og:url, the shared OG fields, and RSS auto-discovery.
 */
export function pageMetadata({
  title,
  description,
  path,
  article,
}: {
  title?: string
  description: string
  path: string
  article?: { publishedTime: string; modifiedTime?: string; tags?: string[] }
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path, types: { ...FEED, 'text/markdown': markdownPath(path) } },
    openGraph: {
      siteName: site.name,
      locale: 'en_US',
      url: path,
      ...(title ? { title } : {}),
      description,
      ...(article
        ? { type: 'article', publishedTime: article.publishedTime, modifiedTime: article.modifiedTime ?? article.publishedTime, authors: [`${site.url}/about`], tags: article.tags }
        : { type: 'website' }),
    },
  }
}
