import type { CalendarDate } from './dates'

export type ElapsedUnit = 'YRS' | 'MOS' | 'DYS'
export interface Elapsed {
  value: number
  unit: ElapsedUnit
}

const dayNumber = (c: CalendarDate) => Date.UTC(c.y, c.m - 1, c.d) / 86_400_000

/** Whole years if at least one, else whole months, else days. Future dates clamp to zero days. */
export function elapsed(from: CalendarDate, to: CalendarDate): Elapsed {
  if (dayNumber(to) <= dayNumber(from)) return { value: 0, unit: 'DYS' }
  let months = (to.y - from.y) * 12 + (to.m - from.m)
  if (to.d < from.d) months -= 1
  if (months >= 12) return { value: Math.floor(months / 12), unit: 'YRS' }
  if (months >= 1) return { value: months, unit: 'MOS' }
  return { value: dayNumber(to) - dayNumber(from), unit: 'DYS' }
}

export const formatElapsed = (e: Elapsed) => `${String(e.value).padStart(2, '0')} ${e.unit}`

const WORD: Record<ElapsedUnit, string> = { YRS: 'year', MOS: 'month', DYS: 'day' }

export function describeElapsed(e: Elapsed): string {
  if (e.value === 0 && e.unit === 'DYS') return 'today'
  return `${e.value} ${WORD[e.unit]}${e.value === 1 ? '' : 's'} ago`
}
