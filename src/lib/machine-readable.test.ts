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

it('carries full content for MDX posts when given a renderer', () => {
  const mdx = post({ format: 'mdx', body: 'compiled-code', slug: 'new', url: '/writing/new' })
  const xml = buildRssFeed([mdx], p => `<p>rendered ${p.slug}</p>`)
  expect(xml).toContain('<content:encoded><![CDATA[<p>rendered new</p>]]></content:encoded>')
})


it('follows the llms.txt layout, linking to Markdown twins', () => {
  const txt = buildLlmsTxt([post({ slug: 'x', url: '/writing/x', title: 'X' })])
  expect(txt).toMatch(/^# Kevin Hunt · kev\.in\n\n> /)
  for (const h of ['## About', '## Writing', '## Projects', '## Elsewhere', '## Optional']) expect(txt).toContain(h)
  expect(txt).toContain('- [X](https://kev.in/writing/x.md)')
  expect(txt).toContain('https://kev.in/about.md')
  expect(txt).toContain('https://kev.in/llms-full.txt')
  expect(txt).not.toMatch(/compliance|Defense/i)
})

it('puts each post in llms-full.txt as clean Markdown', () => {
  const full = buildLlmsFull([post({ body: '<p><strong>Hi</strong> &lt;%= x %&gt;</p>' })])
  expect(full).toContain('### A & B <test>')
  expect(full).toContain('URL: https://kev.in/writing/a-b')
  expect(full).toContain('**Hi** <%= x %>')
  expect(full).not.toMatch(/&#x|&lt;|<p>/)
})
