import { readdirSync } from 'node:fs'
import { legacyRedirects, STATIC_REDIRECTS } from './redirects'

const files = readdirSync('content/archive').filter(f => f.endsWith('.md'))

it('maps every archive post, with and without .html', () => {
  const r = legacyRedirects(files)
  expect(files).toHaveLength(20)
  expect(r).toHaveLength(files.length * 2)
  expect(r).toContainEqual({ source: '/2007/05/17/railsconf-07-day-0.html', destination: '/writing/railsconf-07-day-0', permanent: true })
  expect(r).toContainEqual({ source: '/2007/05/17/railsconf-07-day-0', destination: '/writing/railsconf-07-day-0', permanent: true })
})

it('covers old index, tag and feed URLs', () => {
  const src = STATIC_REDIRECTS.map(r => r.source)
  for (const s of ['/page2', '/page3', '/page4', '/page2.html', '/page4.html', '/tags', '/tags.html', '/tags/:tag*', '/atom.xml', '/index.html']) expect(src).toContain(s)
})

it('ignores non-dated filenames', () => {
  expect(legacyRedirects(['README.md'])).toEqual([])
})

it('sends the old sitemap and icon URLs somewhere real', () => {
  const map = Object.fromEntries(STATIC_REDIRECTS.map(r => [r.source, r.destination]))
  expect(map['/sitemap-index.xml']).toBe('/sitemap.xml')
  expect(map['/sitemap-0.xml']).toBe('/sitemap.xml')
  expect(map['/favicon.ico']).toBe('/icon.svg')
  expect(map['/apple-touch-icon-144-precomposed.png']).toBe('/icon.svg')
})
