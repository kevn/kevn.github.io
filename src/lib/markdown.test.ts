import { htmlToMarkdown, frontmatter } from './markdown'
import { markdownFor, markdownPaths } from './page-markdown'
import { getPosts } from './posts'

it('converts archive HTML to clean Markdown with entities decoded', () => {
  expect(htmlToMarkdown('<p><strong>One</strong> &amp; <a href="/y" title="t">link</a> &lt;%= x %&gt;</p>')).toBe('**One** & [link](/y "t") <%= x %>')
  expect(htmlToMarkdown('<pre><code>a < b\n</code></pre>')).toBe('```\na < b\n```')
})

it('writes YAML frontmatter with quoting', () => {
  expect(frontmatter({ title: 'RailsConf \'07: "Day 0"', tags: ['rails', 'ruby'], empty: undefined })).toBe('---\ntitle: "RailsConf \'07: \\"Day 0\\""\ntags: ["rails", "ruby"]\n---\n')
})

it('publishes a Markdown twin for every page and post', () => {
  const paths = markdownPaths()
  for (const p of ['', 'writing', 'progress', 'about', 'sights']) expect(paths).toContain(p)
  for (const post of getPosts()) expect(paths).toContain(post.url.slice(1))
})

it('renders an archive post as Markdown with canonical frontmatter', () => {
  const md = markdownFor('writing/one-of-these-days')!
  expect(md).toMatch(/^---\ntitle: "One of these days"/)
  expect(md).toContain('canonical: "https://kev.in/writing/one-of-these-days"')
  expect(md).toContain('author: "Kevin Hunt"')
  expect(md).toContain('# One of these days')
  expect(md).toContain('**One of these days**')
  expect(md).not.toMatch(/<p>|&#x/)
})

it('renders the about page with the then/now timeline', () => {
  const md = markdownFor('about')!
  expect(md).toContain('# About Kevin Hunt')
  expect(md).toContain('cybersecurity platform for high-stakes environments')
  expect(md).toContain('- 2009: Joined Yammer early')
})

it('renders home and progress with the workbench', () => {
  expect(markdownFor('')).toContain('# Kevin Hunt')
  expect(markdownFor('progress')).toContain('Machine Mode')
  expect(markdownFor('progress')).toContain('Status: in flight')
})

it('returns null for unknown paths', () => {
  expect(markdownFor('nope')).toBeNull()
  expect(markdownFor('writing/nope')).toBeNull()
})
