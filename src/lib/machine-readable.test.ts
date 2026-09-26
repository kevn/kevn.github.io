import { buildRssFeed, buildLlmsTxt, buildLlmsFull } from './machine-readable'
import type { Post } from './posts'

const post = (over: Partial<Post> = {}): Post => ({
  slug: 'a-b',
  url: '/writing/a-b',
  title: 'A & B <test>',
  dateRaw: '2007-05-17T00:00:00-08:00',
  date: { y: 2007, m: 5, d: 17 },
  kind: 'archive',
  draft: false,
  summary: 'Sum',
  tags: [],
  format: 'html',
  body: '<p>Hi</p>',
  ...over,
})

it('escapes titles and uses absolute links in RSS', () => {
  const xml = buildRssFeed([post()])
  expect(xml.startsWith('<?xml')).toBe(true)
  expect(xml).toContain('<title>A &amp; B &lt;test&gt;</title>')
  expect(xml).toContain('<link>https://kev.in/writing/a-b</link>')
  expect(xml).toContain('<![CDATA[<p>Hi</p>]]>')
  expect(xml).toContain('<pubDate>Thu, 17 May 2007')
})

it('never includes drafts anywhere', () => {
  const d = post({ draft: true, slug: 'secret', url: '/writing/secret', title: 'Secret' })
  expect(buildRssFeed([d])).not.toContain('secret')
  expect(buildLlmsTxt([d])).not.toContain('secret')
  expect(buildLlmsFull([d])).not.toContain('Secret')
})

it('keeps CDATA intact when the body contains the terminator', () => {
  const xml = buildRssFeed([post({ body: '<p>a]]>b</p>' })])
  expect(xml).toContain('<![CDATA[<p>a]]]]><![CDATA[>b</p>]]>')
})
