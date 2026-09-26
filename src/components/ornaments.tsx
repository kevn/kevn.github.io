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

/** Three neon orbits around a glowing nucleus. Decorative. */
export function Atom({ size, className }: { size: number; className?: string }) {
  const orbit = (color: string, rotation: number, cls: string, duration?: string) => (
    <svg width={size} height={size} viewBox="0 0 340 340" className={cls} style={{ position: 'absolute', inset: 0, animationDuration: duration }}>
      <ellipse cx={170} cy={170} rx={160} ry={52} fill="none" stroke={color} strokeWidth={2.5} transform={`rotate(${rotation} 170 170)`} style={glow(color)} />
      {rotation === 0 && <circle cx={330} cy={170} r={9} fill={color} />}
    </svg>
  )
  return (
    <div aria-hidden="true" className={className} style={{ position: 'relative', width: size, height: size }}>
      {orbit('#3ff0ff', 0, 'orbit')}
      {orbit('#ff4fd8', 60, 'orbit-rev')}
      {orbit('#8bff6b', -60, 'orbit', '17s')}
      <div style={{ position: 'absolute', left: '44%', top: '44%', width: '12%', height: '12%', borderRadius: '50%', background: '#ff6b35', boxShadow: '0 0 40px #ff6b35' }} />
    </div>
  )
}
