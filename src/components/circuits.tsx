// Time-circuit readouts, borrowed from the DeLorean in spirit rather than
// costume: colour-coded rows, one segmented window per field with its unlit
// "ghost" segments showing, and a small label — no metal housing.

export const LIT = { red: '#ff6a4d', green: '#39ff14', amber: '#ffb000', cyan: '#3ff0ff', magenta: '#ff4fd8' } as const
export type CircuitTone = keyof typeof LIT

/** Column widths in characters: MONTH / DAY / YEAR. Every row uses the same, so rows line up. */
export const COLS = [3, 2, 4] as const

export function Window({ text, chars, tone }: { text: string; chars: number; tone: CircuitTone }) {
  const color = LIT[tone]
  const lit = text ? text.replace(/ /g, '!').padStart(chars, '!') : '!'.repeat(chars)
  return (
    <span data-window data-chars={chars} data-tone={tone} className="relative block rounded-[4px] border bg-black/40 px-1.5 py-1 font-seg text-[16px] leading-none shadow-[inset_0_1px_4px_rgb(0_0_0/.7)]" style={{ color, borderColor: `${color}26` }}>
      <span className="absolute left-1.5 top-1 opacity-[.13]">{'~'.repeat(chars)}</span>
      <span data-lit className="relative" style={{ textShadow: `0 0 7px ${color}` }}>
        {lit}
      </span>
    </span>
  )
}

export function CircuitRow({
  row,
  caption,
  units,
  values,
  tone,
  cols = COLS,
  tones,
  captionMuted = false,
}: {
  row: string
  caption: string
  units?: readonly string[]
  values: readonly string[] | null
  tone: CircuitTone
  /** Window widths in characters (default MONTH / DAY / YEAR). */
  cols?: readonly number[]
  /** Per-window tones, overriding `tone`. */
  tones?: readonly CircuitTone[]
  /** Neutral caption, when colour is carried by the windows. */
  captionMuted?: boolean
}) {
  return (
    <div data-row={row} className="flex items-center gap-2.5">
      <span className={`w-[62px] font-label text-[10px] tracking-[.16em] ${captionMuted ? 'text-muted' : ''}`} style={captionMuted ? undefined : { color: LIT[tone] }}>
        {caption}
      </span>
      <span className="flex items-start gap-1">
        {cols.map((chars, i) => (
          <span key={i} className="flex flex-col items-end">
            <Window text={values ? values[i] : ''} chars={chars} tone={tones?.[i] ?? tone} />
            {units && (
              <span data-unit className="mt-0.5 font-label text-[8px] tracking-[.14em] text-muted/70">
                {units[i]}
              </span>
            )}
          </span>
        ))}
      </span>
    </div>
  )
}

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className="flex w-fit shrink-0 flex-col gap-1.5">
      {children}
    </div>
  )
}
