import type { Metadata } from 'next'
import { site } from './site'

const FEED = { 'application/rss+xml': [{ url: '/feed.xml', title: site.name }] }

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
  article?: { publishedTime: string }
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path, types: FEED },
    openGraph: {
      siteName: site.name,
      locale: 'en_US',
      url: path,
      ...(title ? { title } : {}),
      description,
      ...(article ? { type: 'article', publishedTime: article.publishedTime } : { type: 'website' }),
    },
  }
}
