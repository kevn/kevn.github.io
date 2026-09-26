import { formatLong, stampParts, type CalendarDate } from '@/lib/dates'
import { CircuitRow, Panel } from './circuits'
import { ElapsedRow, ElapsedSentence, NowRow } from './timestamp-live'

export { toSeg, ghostOf } from './readout'

/** Then/now time circuits for a post: WRITTEN (or DRAFT), UPDATED, PRESENT TIME and TIME ELAPSED. */
export function TimeStamp({ written, updated, draft }: { written: CalendarDate; updated?: CalendarDate; draft?: boolean }) {
  return (
    <div className="shrink-0">
      <Panel>
        <CircuitRow row="written" caption={draft ? 'DRAFT' : 'WRITTEN'} values={stampParts(written)} tone="red" />
        {updated && <CircuitRow row="updated" caption="UPDATED" values={stampParts(updated)} tone="cyan" />}
        <NowRow />
        {!draft && <ElapsedRow from={written} />}
      </Panel>
      <span className="sr-only">
        {draft ? `Draft, dated ${formatLong(written)}.` : <ElapsedSentence prefix={`Written ${formatLong(written)}`} from={written} />}
      </span>
    </div>
  )
}
