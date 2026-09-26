'use client'
import { useEffect, useState } from 'react'
import { formatStamp, todayLocal, type CalendarDate } from '@/lib/dates'
import { describeElapsed, elapsed, formatElapsed } from '@/lib/elapsed'
import { Readout } from './readout'

// Today is read on the client after mount, so statically built pages never
// freeze the build date into NOW (and hydration never mismatches).
function useToday() {
  const [today, setToday] = useState<CalendarDate | null>(null)
  useEffect(() => setToday(todayLocal()), [])
  return today
}

export function LiveNow() {
  const today = useToday()
  return <Readout label="NOW" text={today ? formatStamp(today) : ''} ghostFor="MMM DD YYYY" tone="green" />
}

export function LiveElapsed({ from }: { from: CalendarDate }) {
  const today = useToday()
  return <Readout label="ELAPSED" text={today ? formatElapsed(elapsed(from, today)) : ''} ghostFor="00 YRS" tone="amber" />
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
