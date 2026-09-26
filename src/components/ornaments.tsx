import type { CSSProperties } from 'react'

type Ornament = { size: number; color: string; className?: string; style?: CSSProperties; delay?: number }

const glow = (c: string): CSSProperties => ({ filter: `drop-shadow(0 0 8px ${c})` })

/** Four-point Googie sparkle. Decorative. */
export function Sparkle({ size, color, className, style, delay = 0 }: Ornament) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={`twinkle ${className ?? ''}`} style={{ ...glow(color), animationDelay: `-${delay}s`, ...style }}>
      <path d="M50 0 L57 43 L100 50 L57 57 L50 100 L43 57 L0 50 L43 43 Z" fill={color} />
    </svg>
  )
}

/** Sixteen-ray atomic-age starburst. Decorative. */
export function Starburst({ size, color, className, style, delay = 0 }: Ornament) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8
    return (
      <line
        key={i}
        x1={50}
        y1={50}
        x2={+(50 + 48 * Math.cos(a)).toFixed(1)}
        y2={+(50 + 48 * Math.sin(a)).toFixed(1)}
        stroke={color}
        strokeWidth={i % 2 ? 1.5 : 3}
        strokeLinecap="round"
      />
    )
  })
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={`twinkle ${className ?? ''}`} style={{ ...glow(color), animationDelay: `-${delay}s`, ...style }}>
      {rays}
      <circle cx={50} cy={50} r={6} fill={color} />
    </svg>
  )
}
