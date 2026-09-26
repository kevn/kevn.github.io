/** DSEG glyph strings: '!' is a full-width blank, '~' lights every segment. */
export const toSeg = (text: string) => text.replace(/ /g, '!')
export const ghostOf = (text: string) => text.replace(/[^ :]/g, '~').replace(/ /g, '!')

const TONE = { magenta: '#ff4fd8', green: '#8bff6b', amber: '#ffb000', cyan: '#3ff0ff' } as const
export type Tone = keyof typeof TONE

/** One label plate + segmented readout. Unlit "ghost" segments show behind the lit text. Decorative; callers supply an accessible equivalent. */
export function Readout({ label, text, tone, ghostFor }: { label: string; text: string; tone: Tone; ghostFor?: string }) {
  const color = TONE[tone]
  const ghost = ghostOf(ghostFor ?? text)
  // Pad the lit text with blank ('!') cells so it spans the full ghost width.
  const lit = text ? toSeg(text).padEnd(ghost.length, '!') : ghost.replace(/~/g, '!')
  return (
    <div className="flex items-center gap-2.5" aria-hidden="true">
      <span className="min-w-[74px] rounded-[2px] bg-[#b3241c] px-1.5 py-0.5 text-center font-body text-[9px] font-bold uppercase tracking-[.14em] text-white shadow-[0_1px_0_rgb(0_0_0/.4)]">{label}</span>
      <span className="relative whitespace-nowrap rounded-[3px] bg-[#0b0605] px-2.5 py-1.5 font-seg text-[15px] leading-none shadow-[inset_0_2px_6px_rgb(0_0_0/.9),0_1px_0_rgb(255_255_255/.12)]" style={{ color, textShadow: `0 0 8px ${color}, 0 0 2px ${color}` }}>
        <span className="absolute left-2.5 top-1.5 opacity-[.14] [text-shadow:none]">{ghost}</span>
        <span className="relative">{lit}</span>
      </span>
    </div>
  )
}
