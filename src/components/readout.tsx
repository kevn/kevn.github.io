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
      <span className="min-w-[62px] font-label text-[10px] tracking-[.16em]" style={{ color, opacity: 0.85 }}>{label}</span>
      <span className="relative whitespace-nowrap rounded-[4px] border bg-black/40 px-1.5 py-1 font-seg text-[16px] leading-none shadow-[inset_0_1px_4px_rgb(0_0_0/.7)]" style={{ color, borderColor: `${color}26`, textShadow: `0 0 7px ${color}` }}>
        <span className="absolute left-1.5 top-1 opacity-[.13] [text-shadow:none]">{ghost}</span>
        <span className="relative">{lit}</span>
      </span>
    </div>
  )
}
