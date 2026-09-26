import { calendarDate, formatStamp, formatLong, todayLocal } from './dates'

it('reads the calendar date from the source string, ignoring timezone', () => {
  expect(calendarDate('2007-02-06T00:00:00-08:00')).toEqual({ y: 2007, m: 2, d: 6 })
  expect(calendarDate('2026-10-01')).toEqual({ y: 2026, m: 10, d: 1 })
})

it('formats stamps and long dates', () => {
  expect(formatStamp({ y: 2007, m: 5, d: 17 })).toBe('MAY 17 2007')
  expect(formatStamp({ y: 2026, m: 9, d: 6 })).toBe('SEP 06 2026')
  expect(formatLong({ y: 2007, m: 5, d: 17 })).toBe('May 17, 2007')
})

it('reads today in local time', () => {
  expect(todayLocal(new Date(2026, 8, 26, 23, 59))).toEqual({ y: 2026, m: 9, d: 26 })
})

it('rejects a malformed date', () => {
  expect(() => calendarDate('not a date')).toThrow()
})
