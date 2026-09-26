import { WORKBENCH, shelf, STATUSES } from './workbench'

it('only uses the four statuses', () => {
  for (const item of WORKBENCH) expect(STATUSES).toContain(item.status)
})

it('puts active work first, then the bench, then the mothballed past', () => {
  const order = shelf(WORKBENCH).map(i => STATUSES.indexOf(i.status))
  expect(order).toEqual([...order].sort((a, b) => a - b))
})

it('shows the most recently touched items first within a status', () => {
  const items = [
    { slug: 'a', name: 'A', hook: '', started: 2020, updated: '2024-01', status: 'IN FLIGHT' as const },
    { slug: 'b', name: 'B', hook: '', started: 2020, updated: '2026-05', status: 'IN FLIGHT' as const },
    { slug: 'c', name: 'C', hook: '', started: 2007, updated: '2008-01', status: 'MOTHBALLED' as const },
  ]
  expect(shelf(items).map(i => i.slug)).toEqual(['b', 'a', 'c'])
  expect(shelf(items, 2).map(i => i.slug)).toEqual(['b', 'a'])
})

it('keeps Deep Fathom and Rival Bear work off the personal shelf', () => {
  const slugs = WORKBENCH.map(i => i.slug)
  for (const s of ['agentos', 'tidepool', 'firmament', 'guitar-drills']) expect(slugs).not.toContain(s)
})

it('home shelf mixes current work with one piece of the past', async () => {
  const { homeShelf } = await import('./workbench')
  const picks = homeShelf(WORKBENCH)
  expect(picks).toHaveLength(4)
  expect(picks.slice(0, 3).every(i => i.status !== 'MOTHBALLED')).toBe(true)
  expect(picks[3].status).toBe('MOTHBALLED')
  expect(picks[3].slug).toBe('dibs-net')
})
