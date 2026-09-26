export interface TimelineEntry {
  /** null = year still to confirm; shown as dashes. */
  year: number | null
  what: string
  href?: string
}

/** Then → now. Years marked null are placeholders for Kevin to fill in. */
export const TIMELINE: TimelineEntry[] = [
  { year: null, what: 'Shipping software over dialup.' },
  { year: 2005, what: 'Registered kev.in.' },
  { year: 2007, what: 'Launched dibs.net and blogged about Rails here.', href: '/writing/announcing-dibs-net' },
  { year: null, what: 'Joined Yammer as an early engineer; later led engineering for Office 365 / Yammer at Microsoft.' },
  { year: null, what: 'CTO, Cloud Storage Security.' },
  { year: null, what: 'Co-founded Deep Fathom as CTO.', href: 'https://www.deepfathom.ai' },
  { year: null, what: 'Started Rival Bear to make small, useful apps.', href: 'https://rivalbear.com' },
  { year: 2026, what: 'Brought kev.in back to life. Writing again.' },
]

export const yearText = (year: number | null) => (year === null ? '----' : String(year))
