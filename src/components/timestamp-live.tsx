'use client'
import { useEffect, useState } from 'react'
import { stampParts, todayLocal, type CalendarDate } from '@/lib/dates'
import { describeElapsed, elapsed, elapsedParts } from '@/lib/elapsed'
import { CircuitRow } from './circuits'

// Today is read on the client after mount, so statically built pages never
// freeze the build date into NOW (and hydration never mismatches).
function useToday() {
  const [today, setToday] = useState<CalendarDate | null>(null)
  useEffect(() => setToday(todayLocal()), [])
  return today
}

export function NowRow() {
  const today = useToday()
  return <CircuitRow row="now" caption="PRESENT TIME" labels={['MONTH', 'DAY', 'YEAR']} values={today ? stampParts(today) : null} tone="green" />
}

export function ElapsedRow({ from }: { from: CalendarDate }) {
  const today = useToday()
  const p = today ? elapsedParts(from, today) : null
  const values = p ? ([String(p.y).padStart(3, '!'), String(p.m).padStart(2, '0'), String(p.d).padStart(2, '0').padStart(4, '!')] as const) : null
  return <CircuitRow row="elapsed" caption="TIME ELAPSED" labels={['YRS', 'MOS', 'DAYS']} values={values} tone="amber" />
}

/** Screen-reader sentence: "Written May 17, 2007 — 19 years ago." (the elapsed clause appears after mount). */
export function ElapsedSentence({ prefix, from }: { prefix: string; from: CalendarDate }) {
  const today = useToday()
  return (
    <>
      {prefix}
      {today ? ` — ${describeElapsed(elapsed(from, today))}.` : '.'}
    </>
  )
}
