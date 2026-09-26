/** DSEG glyph strings: '!' is a full-width blank, '~' lights every segment. */
export const toSeg = (text: string) => text.replace(/ /g, '!')
export const ghostOf = (text: string) => text.replace(/[^ ]/g, '~').replace(/ /g, '!')

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
      <span className="min-w-[74px] border border-[#3a3848] bg-[#16151c] px-1.5 py-0.5 text-center font-label text-[10px] tracking-[.14em] text-[#e9e6f2]">{label}</span>
      <span className="relative whitespace-nowrap border border-[#2a2833] bg-[#08070b] px-2.5 py-1.5 font-seg text-[15px] leading-none" style={{ color, textShadow: `0 0 10px ${color}` }}>
        <span className="absolute left-2.5 top-1.5 opacity-[.13] [text-shadow:none]">{ghost}</span>
        <span className="relative">{lit}</span>
      </span>
    </div>
  )
}
