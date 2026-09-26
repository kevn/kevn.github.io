// Time-circuit display parts, after the DeLorean's: red label plates over
// recessed segmented windows (unlit "ghost" segments visible), a black
// caption plate under each row, all on a brushed-metal panel.

export const LIT = { red: '#ff3b1f', green: '#39ff14', amber: '#ffb000', cyan: '#3ff0ff' } as const
export type CircuitTone = keyof typeof LIT

/** Column widths in characters: MONTH / DAY / YEAR. Every row uses the same, so the panel lines up. */
export const COLS = [3, 2, 4] as const

export function Window({ text, chars, tone }: { text: string; chars: number; tone: CircuitTone }) {
  const color = LIT[tone]
  const lit = text ? text.replace(/ /g, '!').padStart(chars, '!') : '!'.repeat(chars)
  return (
    <span data-window data-chars={chars} className="relative block rounded-[3px] bg-[#0b0605] px-2 py-1.5 font-seg text-[17px] leading-none shadow-[inset_0_2px_6px_rgb(0_0_0/.9),0_1px_0_rgb(255_255_255/.15)]" style={{ color }}>
      <span className="absolute left-2 top-1.5 opacity-[.14]">{'~'.repeat(chars)}</span>
      <span data-lit className="relative" style={{ textShadow: `0 0 8px ${color}, 0 0 2px ${color}` }}>
        {lit}
      </span>
    </span>
  )
}

export function Plate({ children, tone = 'red' }: { children: React.ReactNode; tone?: 'red' | 'black' }) {
  return (
    <span className={`inline-block rounded-[2px] px-1.5 py-[1px] font-body text-[8.5px] font-bold uppercase tracking-[.12em] text-white ${tone === 'red' ? 'bg-[#b3241c] shadow-[0_1px_0_rgb(0_0_0/.4)]' : 'bg-[#101010] px-2.5 text-[9.5px] tracking-[.22em]'}`}>
      {children}
    </span>
  )
}

export function CircuitRow({ row, caption, labels, values, tone }: { row: string; caption: string; labels: readonly [string, string, string]; values: readonly [string, string, string] | null; tone: CircuitTone }) {
  return (
    <div data-row={row} className="flex flex-col items-center gap-1">
      <div className="flex items-end gap-1.5">
        {COLS.map((chars, i) => (
          <span key={i} className="flex flex-col items-center gap-[3px]">
            <Plate>{labels[i]}</Plate>
            <Window text={values ? values[i] : ''} chars={chars} tone={tone} />
          </span>
        ))}
      </div>
      <Plate tone="black">{caption}</Plate>
    </div>
  )
}

/** The brushed-metal housing. */
export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex w-fit shrink-0 flex-col gap-2.5 rounded-md border border-black/60 px-3 py-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/.25),0_6px_18px_rgb(0_0_0/.45)]"
      style={{
        background:
          'radial-gradient(circle at 20% 30%, rgb(255 255 255 / .08) 0 1px, transparent 2px) 0 0/7px 7px, radial-gradient(circle at 70% 60%, rgb(0 0 0 / .12) 0 1px, transparent 2px) 0 0/9px 9px, linear-gradient(180deg, #8d9097, #686b72)',
      }}
    >
      {children}
    </div>
  )
}
