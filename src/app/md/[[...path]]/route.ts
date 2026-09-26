import { markdownFor, markdownPaths } from '@/lib/page-markdown'
import { site } from '@/lib/site'

// Markdown twins. Public URLs (/about.md, /writing/<slug>.md, /index.md) and
// Accept: text/markdown requests are rewritten here by next.config.ts.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return markdownPaths().map(p => ({ path: p ? p.split('/') : [] }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const key = ((await params).path ?? []).join('/')
  const md = markdownFor(key)
  if (!md) return new Response('Not found\n', { status: 404, headers: { 'content-type': 'text/markdown; charset=utf-8' } })
  return new Response(md, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      link: `<${site.url}/${key}>; rel="canonical"`,
      vary: 'Accept',
    },
  })
}
