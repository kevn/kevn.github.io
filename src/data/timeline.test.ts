import { TIMELINE, yearText } from './timeline'

it('runs oldest to newest, with unknown years kept in their written order', () => {
  const known = TIMELINE.filter(t => t.year !== null).map(t => t.year!)
  expect(known).toEqual([...known].sort((a, b) => a - b))
})

it('shows dashes for years still to be confirmed', () => {
  expect(yearText(2007)).toBe('2007')
  expect(yearText(null)).toBe('----')
})

it('starts with the dialup days and ends with this site coming back', () => {
  expect(TIMELINE[0].what).toMatch(/dialup/i)
  expect(TIMELINE.at(-1)).toMatchObject({ year: 2026 })
})
