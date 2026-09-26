import { buildLlmsFull } from '@/lib/machine-readable'
import { getPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsFull(getPosts()), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
