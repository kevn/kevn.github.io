export interface CalendarDate {
  y: number
  m: number
  d: number
}

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** The calendar date as written in the source string, independent of its timezone offset. */
export function calendarDate(iso: string): CalendarDate {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) throw new Error(`Not an ISO date: ${iso}`)
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) }
}

export function todayLocal(now: Date = new Date()): CalendarDate {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() }
}

export const formatStamp = (c: CalendarDate) => `${MON[c.m - 1]} ${String(c.d).padStart(2, '0')} ${c.y}`

export const formatLong = (c: CalendarDate) => `${MONTH[c.m - 1]} ${c.d}, ${c.y}`
