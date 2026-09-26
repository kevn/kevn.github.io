import { selectPosts, homeDispatches, assertUniqueSlugs, includeDrafts, slugFromPath, type Post } from './posts'

const p = (slug: string, dateRaw: string, kind: Post['kind'] = 'essay', draft = false): Post => ({
  slug,
  url: `/writing/${slug}`,
  title: slug,
  dateRaw,
  date: { y: Number(dateRaw.slice(0, 4)), m: 1, d: 1 },
  kind,
  draft,
  summary: '',
  tags: [],
  format: kind === 'archive' ? 'html' : 'mdx',
  body: '',
})

it('derives slugs from paths', () => {
  expect(slugFromPath('archive/2007-05-17-railsconf-07-day-0')).toBe('railsconf-07-day-0')
  expect(slugFromPath('writing/2026-10-01-agents')).toBe('agents')
})

it('hides drafts only in production', () => {
  expect(includeDrafts('production')).toBe(false)
  expect(includeDrafts('preview')).toBe(true)
  expect(includeDrafts(undefined)).toBe(true)
  const all = [p('a', '2026-01-01', 'essay', true), p('b', '2026-02-01')]
  expect(selectPosts(all, 'production').map(x => x.slug)).toEqual(['b'])
  expect(selectPosts(all, 'preview').map(x => x.slug)).toEqual(['b', 'a'])
})

it('fills the home dispatches with new writing first, then archive', () => {
  const posts = selectPosts([p('old1', '2007-05-17', 'archive'), p('old2', '2007-08-01', 'archive'), p('new', '2026-10-01')], 'production')
  expect(homeDispatches(posts).map(x => x.slug)).toEqual(['new', 'old2', 'old1'])
  const four = selectPosts([p('n1', '2026-01-01'), p('n2', '2026-02-01'), p('n3', '2026-03-01'), p('n4', '2026-04-01')], 'production')
  expect(homeDispatches(four).map(x => x.slug)).toEqual(['n4', 'n3', 'n2'])
})

it('rejects duplicate slugs across collections', () => {
  expect(() => assertUniqueSlugs([p('x', '2007-01-01', 'archive'), p('x', '2026-01-01')])).toThrow(/x/)
})

it('pads a too-short archive description with context, keeping it under 160', async () => {
  const { describePost } = await import('./posts')
  expect(describePost('Short.', 2007)).toBe("Short. From Kevin Hunt's 2007 archive on kev.in.")
  const long = 'x'.repeat(120)
  expect(describePost(long, 2007)).toBe(long)
})
