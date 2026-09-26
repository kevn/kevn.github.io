import { pageMetadata } from './seo'

it('gives every page its own canonical and og:url, plus shared OG and RSS discovery', () => {
  const m = pageMetadata({ title: 'About', description: 'd', path: '/about' })
  expect(m.alternates?.canonical).toBe('/about')
  expect(m.alternates?.types).toEqual({ 'application/rss+xml': [{ url: '/feed.xml', title: 'kev.in' }], 'text/markdown': '/about.md' })
  expect(pageMetadata({ description: 'd', path: '/' }).alternates?.types).toMatchObject({ 'text/markdown': '/index.md' })
  expect(m.openGraph).toMatchObject({ url: '/about', siteName: 'kev.in', locale: 'en_US', type: 'website', title: 'About', description: 'd' })
})

it('supports article metadata for posts', () => {
  const m = pageMetadata({ title: 'T', description: 'd', path: '/writing/t', article: { publishedTime: '2007-05-17' } })
  expect(m.openGraph).toMatchObject({ type: 'article', publishedTime: '2007-05-17', url: '/writing/t', siteName: 'kev.in' })
})
