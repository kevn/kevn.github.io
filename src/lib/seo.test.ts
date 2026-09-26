import { pageMetadata } from './seo'

it('gives every page its own canonical and og:url, plus shared OG and RSS discovery', () => {
  const m = pageMetadata({ title: 'Now', description: 'd', path: '/now' })
  expect(m.alternates?.canonical).toBe('/now')
  expect(m.alternates?.types).toEqual({ 'application/rss+xml': [{ url: '/feed.xml', title: 'kev.in' }] })
  expect(m.openGraph).toMatchObject({ url: '/now', siteName: 'kev.in', locale: 'en_US', type: 'website', title: 'Now', description: 'd' })
})

it('supports article metadata for posts', () => {
  const m = pageMetadata({ title: 'T', description: 'd', path: '/writing/t', article: { publishedTime: '2007-05-17' } })
  expect(m.openGraph).toMatchObject({ type: 'article', publishedTime: '2007-05-17', url: '/writing/t', siteName: 'kev.in' })
})
