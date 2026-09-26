import { pageMetadata } from './seo'

it('gives every page its own canonical and og:url, plus shared OG and RSS discovery', () => {
  const m = pageMetadata({ title: 'About', description: 'd', path: '/about' })
  expect(m.alternates?.canonical).toBe('/about')
  expect(m.alternates?.types).toEqual({ 'application/rss+xml': [{ url: '/feed.xml', title: 'kev.in' }], 'text/markdown': '/about.md' })
  expect(pageMetadata({ description: 'd', path: '/' }).alternates?.types).toMatchObject({ 'text/markdown': '/index.md' })
  expect(m.openGraph).toMatchObject({ url: '/about', siteName: 'kev.in', locale: 'en_US', type: 'website', title: 'About', description: 'd' })
})

it('supports article metadata for posts', () => {
  const m = pageMetadata({ title: 'T', description: 'd', path: '/writing/t', article: { publishedTime: '2007-05-17', modifiedTime: '2008-01-02', tags: ['rails'] } })
  expect(m.openGraph).toMatchObject({ type: 'article', publishedTime: '2007-05-17', modifiedTime: '2008-01-02', authors: ['https://kev.in/about'], tags: ['rails'], url: '/writing/t', siteName: 'kev.in' })
})

it('drops the site suffix only when a title would run past 70 characters', async () => {
  const { pageTitle } = await import('./seo')
  expect(pageTitle('Writing')).toBe('Writing')
  const long = "Top Ten Most Frequently Things Overheard* at RailsConf '07 in Portland, OR"
  expect(pageTitle(long)).toEqual({ absolute: long })
})
