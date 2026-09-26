import { TIMELINE, yearText } from './timeline'

it('has the confirmed years, oldest to newest', () => {
  expect(TIMELINE.map(t => t.year)).toEqual([1994, 2007, 2009, 2024, 2025, 2026, 2026])
})

it("doesn't brag about owning the domain", () => {
  for (const t of TIMELINE) expect(t.what).not.toMatch(/registered|domain/i)
})

it('shows dashes for years still to be confirmed', () => {
  expect(yearText(2007)).toBe('2007')
  expect(yearText(null)).toBe('----')
})

it('reads like a story, not a resume: no job titles or headcounts', () => {
  const yammer = TIMELINE.find(t => t.year === 2009)!
  expect(yammer.what).toBe('Joined Yammer early, and stayed through the Microsoft acquisition until 2018.')
  for (const t of TIMELINE) expect(t.what).not.toMatch(/manager|employee #|engineer #|\bDAU\b|\$\d/i)
})
