import type { Metadata } from 'next'
import { site } from './site'

const FEED = { 'application/rss+xml': [{ url: '/feed.xml', title: site.name }] }

const SUFFIX = ` · ${site.name}`

/** Page title for the layout template; long titles skip the " · kev.in" suffix to stay within 70 characters. */
export const pageTitle = (title: string): string | { absolute: string } => ((title + SUFFIX).length > 70 ? { absolute: title } : title)

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
    ...(title ? { title: pageTitle(title) } : {}),
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
