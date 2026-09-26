// Dependency-free so next.config.ts can import it directly.

export interface Redirect {
  source: string
  destination: string
  permanent: true
}

/** Old Jekyll/Astro post URLs (/YYYY/MM/DD/slug[.html]) → /writing/slug, one explicit pair per archive file. */
export function legacyRedirects(archiveFilenames: string[]): Redirect[] {
  return archiveFilenames.flatMap(f => {
    const m = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/.exec(f)
    if (!m) return []
    const [, y, mo, d, slug] = m
    const destination = `/writing/${slug}`
    return [
      { source: `/${y}/${mo}/${d}/${slug}.html`, destination, permanent: true as const },
      { source: `/${y}/${mo}/${d}/${slug}`, destination, permanent: true as const },
    ]
  })
}

const toWriting = ['/page2', '/page3', '/page4', '/page2.html', '/page3.html', '/page4.html', '/tags', '/tags.html', '/tags/:tag*']

export const STATIC_REDIRECTS: Redirect[] = [
  ...toWriting.map(source => ({ source, destination: '/writing', permanent: true as const })),
  { source: '/atom.xml', destination: '/feed.xml', permanent: true },
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/sitemap-index.xml', destination: '/sitemap.xml', permanent: true },
  { source: '/sitemap-0.xml', destination: '/sitemap.xml', permanent: true },
  { source: '/favicon.ico', destination: '/icon.svg', permanent: true },
  { source: '/apple-touch-icon-144-precomposed.png', destination: '/icon.svg', permanent: true },
]
