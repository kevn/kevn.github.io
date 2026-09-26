export const STATUSES = ['LIVE', 'IN FLIGHT', 'ON THE BENCH', 'MOTHBALLED'] as const
export type WorkbenchStatus = (typeof STATUSES)[number]

export interface WorkbenchItem {
  slug: string
  name: string
  hook: string
  started: number
  /** YYYY-MM of the last real change; orders the shelf within a status. */
  updated: string
  status: WorkbenchStatus
  href?: string
}

/**
 * Personal projects only — Deep Fathom work and Rival Bear products or
 * candidates stay off this shelf. Flip `status`/`updated` as things move.
 */
export const WORKBENCH: WorkbenchItem[] = [
  { slug: 'machine-mode', name: 'Machine Mode', hook: 'A standard for tools that AI agents can operate safely.', started: 2026, updated: '2026-07', status: 'IN FLIGHT', href: 'https://machinemode.io' },
  { slug: 'osm-to-obj', name: 'osm-to-obj', hook: 'Turns OpenStreetMap around any lat/long into a 3D scene.', started: 2024, updated: '2026-08', status: 'IN FLIGHT' },
  { slug: 'ersatztv-ai', name: 'ErsatzTV AI collections', hook: 'AI-curated TV channels built from my own media library.', started: 2024, updated: '2026-06', status: 'IN FLIGHT' },
  { slug: 'waterdog', name: 'Waterdog trail map', hook: 'A trail map for a local lake, built from GIS data.', started: 2020, updated: '2026-05', status: 'IN FLIGHT' },
  { slug: 'lllm', name: 'lllm', hook: 'A coding agent that learns from its own traces.', started: 2026, updated: '2026-05', status: 'ON THE BENCH' },
  { slug: 'fenn-chase', name: 'The Fenn chase', hook: "My solve for Forrest Fenn's treasure hunt, written up after the chest was found.", started: 2020, updated: '2020-06', status: 'MOTHBALLED', href: 'https://rivalbear.com/chase' },
  { slug: 'nightswatch', name: 'Nightswatch', hook: 'Round-the-clock monitoring for the homelab.', started: 2024, updated: '2026-06', status: 'MOTHBALLED' },
  { slug: 'kindle-dash', name: 'Kindle dash', hook: 'An old Kindle turned into an e-ink wall dashboard.', started: 2023, updated: '2023-10', status: 'MOTHBALLED' },
  { slug: 'nonagon', name: 'Nonagon', hook: 'A live-stream rig built for King Gizzard & the Lizard Wizard shows.', started: 2019, updated: '2019-12', status: 'MOTHBALLED' },
  { slug: 'ticket-stalker', name: 'Ticket stalker', hook: "Watched ticket prices so I didn't have to.", started: 2019, updated: '2020-11', status: 'MOTHBALLED' },
  { slug: 'dibs-net', name: 'dibs.net', hook: 'My 2007 startup. Born 3pm July 15, 2007; 0 lbs 0 oz.', started: 2007, updated: '2008-01', status: 'MOTHBALLED', href: '/writing/announcing-dibs-net' },
]

/** Active first, then the bench, then the mothballed past; newest change first within each. */
export function shelf(items: WorkbenchItem[], n?: number): WorkbenchItem[] {
  const sorted = [...items].sort((a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status) || b.updated.localeCompare(a.updated))
  return n === undefined ? sorted : sorted.slice(0, n)
}

/** Home page: the three freshest active projects plus the oldest mothballed one — then and now. */
export function homeShelf(items: WorkbenchItem[]): WorkbenchItem[] {
  const active = shelf(items).filter(i => i.status !== 'MOTHBALLED').slice(0, 3)
  const past = items.filter(i => i.status === 'MOTHBALLED').sort((a, b) => a.started - b.started)[0]
  return past ? [...active, past] : active
}
