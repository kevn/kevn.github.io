import type { NextConfig } from 'next'
import { readdirSync } from 'node:fs'
import { legacyRedirects, STATIC_REDIRECTS } from './src/lib/redirects'

const WANTS_MARKDOWN = [{ type: 'header' as const, key: 'accept', value: '(.*)text/markdown(.*)' }]
const PAGES = '(about|progress|writing|sights)'

const nextConfig: NextConfig = {
  async redirects() {
    return [...legacyRedirects(readdirSync('content/archive')), ...STATIC_REDIRECTS]
  },
  async rewrites() {
    return {
      // Markdown twins for AI crawlers and agents: explicit .md URLs, and
      // content negotiation on the canonical URLs.
      beforeFiles: [
        { source: '/index.md', destination: '/md' },
        { source: `/:page${PAGES}.md`, destination: '/md/:page' },
        { source: '/writing/:slug([^/.]+).md', destination: '/md/writing/:slug' },
        { source: '/', has: WANTS_MARKDOWN, destination: '/md' },
        { source: `/:page${PAGES}`, has: WANTS_MARKDOWN, destination: '/md/:page' },
        { source: '/writing/:slug', has: WANTS_MARKDOWN, destination: '/md/writing/:slug' },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
