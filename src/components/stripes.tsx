const COLORS = ['#ff4fd8', '#7b6cff', '#3ff0ff', '#8bff6b']

/**
 * The four kev.in bands as racing stripes. `hero-bend` runs across a 1440×300
 * box and bends down at the right edge (desktop); `straight` runs across only.
 */
export function Stripes({ variant, className }: { variant: 'hero-bend' | 'straight'; className?: string }) {
  if (variant === 'straight')
    return (
      <svg aria-hidden="true" viewBox="0 0 400 80" preserveAspectRatio="none" className={`block h-20 w-full ${className ?? ''}`}>
        {COLORS.map((c, i) => (
          <line key={c} className="draw" x1={-10} x2={410} y1={10 + i * 20} y2={10 + i * 20} stroke={c} strokeWidth={10} strokeLinecap="round" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </svg>
    )
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 300" fill="none" className={`block h-auto w-full ${className ?? ''}`}>
      {COLORS.map((c, i) => {
        const r = 110 - i * 20
        return <path key={c} className="draw" d={`M-20 ${10 + i * 20} H1250 a${r} ${r} 0 0 1 ${r} ${r} V300`} stroke={c} strokeWidth={12} strokeLinecap="round" style={{ animationDelay: `${i * 0.12}s` }} />
      })}
    </svg>
  )
}
