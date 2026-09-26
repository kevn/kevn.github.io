import Link from 'next/link'
import { Readout, type Tone } from './readout'
import type { WorkbenchItem, WorkbenchStatus } from '@/data/workbench'

const TONE: Record<WorkbenchStatus, Tone> = { LIVE: 'cyan', 'IN FLIGHT': 'green', 'ON THE BENCH': 'amber', MOTHBALLED: 'magenta' }
const ACCENT: Record<Tone, string> = { cyan: '#3ff0ff', green: '#8bff6b', amber: '#ffb000', magenta: '#ff4fd8' }

/** One personal project on the workbench shelf: hook plus STARTED / STATUS readouts. */
export function WorkbenchCard({ item }: { item: WorkbenchItem }) {
  const tone = TONE[item.status]
  const body = (
    <>
      <h3 className="font-display text-lg leading-snug text-cream md:text-xl">{item.name}</h3>
      <p className="mt-2 flex-grow text-[16px] leading-relaxed text-muted">{item.hook}</p>
      <div className="mt-5 flex flex-col gap-2">
        <Readout label="STARTED" text={String(item.started)} tone="cyan" />
        <Readout label="STATUS" text={item.status} tone={tone} ghostFor="ON THE BENCH" />
      </div>
      <p className="sr-only">
        Started {item.started}. Status: {item.status.toLowerCase()}.
      </p>
    </>
  )
  const cls = 'flex h-full flex-col rounded-[36px_10px_36px_10px] border border-cream/10 bg-cream/[.035] p-6'
  const style = { borderTop: `3px solid ${ACCENT[tone]}` }
  if (!item.href) return <div className={cls} style={style}>{body}</div>
  const external = item.href.startsWith('http')
  const hover = `${cls} transition-transform duration-300 hover:-translate-y-1.5`
  return external ? (
    <a href={item.href} target="_blank" rel="noopener" className={hover} style={style}>
      {body}
    </a>
  ) : (
    <Link href={item.href} className={hover} style={style}>
      {body}
    </Link>
  )
}
