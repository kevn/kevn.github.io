import { elapsed, formatElapsed, describeElapsed } from './elapsed'

const c = (y: number, m: number, d: number) => ({ y, m, d })

it('counts whole years once at least a year has passed', () => {
  expect(elapsed(c(2007, 5, 17), c(2026, 9, 26))).toEqual({ value: 19, unit: 'YRS' })
  expect(elapsed(c(2007, 9, 27), c(2026, 9, 26))).toEqual({ value: 18, unit: 'YRS' })
})

it('falls back to months, then days', () => {
  expect(elapsed(c(2026, 6, 26), c(2026, 9, 26))).toEqual({ value: 3, unit: 'MOS' })
  expect(elapsed(c(2026, 6, 27), c(2026, 9, 26))).toEqual({ value: 2, unit: 'MOS' })
  expect(elapsed(c(2026, 9, 14), c(2026, 9, 26))).toEqual({ value: 12, unit: 'DYS' })
  expect(elapsed(c(2026, 9, 26), c(2026, 9, 26))).toEqual({ value: 0, unit: 'DYS' })
})

it('handles leap days', () => {
  expect(elapsed(c(2024, 2, 29), c(2025, 2, 28))).toEqual({ value: 11, unit: 'MOS' })
  expect(elapsed(c(2024, 2, 29), c(2025, 3, 1))).toEqual({ value: 1, unit: 'YRS' })
})

it('clamps a future date to zero days', () => {
  expect(elapsed(c(2027, 1, 1), c(2026, 9, 26))).toEqual({ value: 0, unit: 'DYS' })
})

it('formats and describes', () => {
  expect(formatElapsed({ value: 3, unit: 'MOS' })).toBe('03 MOS')
  expect(formatElapsed({ value: 19, unit: 'YRS' })).toBe('19 YRS')
  expect(describeElapsed({ value: 1, unit: 'YRS' })).toBe('1 year ago')
  expect(describeElapsed({ value: 3, unit: 'MOS' })).toBe('3 months ago')
  expect(describeElapsed({ value: 0, unit: 'DYS' })).toBe('today')
  expect(describeElapsed({ value: 1, unit: 'DYS' })).toBe('1 day ago')
})
