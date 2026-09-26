import { archive } from '#site/content'
import { getPosts } from './posts'

it('migrates all 20 archive posts', () => {
  expect(archive).toHaveLength(20)
})

it('keeps raw HTML markup intact', () => {
  const first = archive.find(a => a.path.endsWith('one-of-these-days'))!
  expect(first.html).toContain('<strong>One of these days</strong>')
  expect(first.html).toContain('title="Joel on Software"')
})

it('keeps the calendar date regardless of timezone', () => {
  const first = getPosts().find(p => p.slug === 'one-of-these-days')!
  expect(first.date).toEqual({ y: 2007, m: 2, d: 6 })
})
