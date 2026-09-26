import { buildRssFeed } from '@/lib/machine-readable'
import { getPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildRssFeed(getPosts(), p => p.feedHtml ?? ''), { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } })
}
