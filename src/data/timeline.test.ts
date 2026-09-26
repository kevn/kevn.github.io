import { TIMELINE, yearText } from './timeline'

it('has the confirmed years, oldest to newest', () => {
  expect(TIMELINE.map(t => t.year)).toEqual([1994, 2007, 2010, 2024, 2025, 2026, 2026])
})

it("doesn't brag about owning the domain", () => {
  for (const t of TIMELINE) expect(t.what).not.toMatch(/registered|domain/i)
})

it('shows dashes for years still to be confirmed', () => {
  expect(yearText(2007)).toBe('2007')
  expect(yearText(null)).toBe('----')
})
