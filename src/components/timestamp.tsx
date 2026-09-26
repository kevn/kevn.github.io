import { formatLong, formatStamp, type CalendarDate } from '@/lib/dates'
import { Readout } from './readout'
import { ElapsedSentence, LiveElapsed, LiveNow } from './timestamp-live'

export { toSeg, ghostOf } from './readout'

/** Then/now readouts for a post: WRITTEN (or STATUS: DRAFT), UPDATED, NOW and ELAPSED. */
export function TimeStamp({ written, updated, draft }: { written: CalendarDate; updated?: CalendarDate; draft?: boolean }) {
  return (
    <div className="flex shrink-0 flex-col gap-2">
      {draft ? <Readout label="STATUS" text="DRAFT" tone="magenta" /> : <Readout label="WRITTEN" text={formatStamp(written)} tone="magenta" />}
      {updated && <Readout label="UPDATED" text={formatStamp(updated)} tone="cyan" />}
      <LiveNow />
      {!draft && <LiveElapsed from={written} />}
      <span className="sr-only">
        {draft ? `Draft, dated ${formatLong(written)}.` : <ElapsedSentence prefix={`Written ${formatLong(written)}`} from={written} />}
      </span>
    </div>
  )
}
