'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { clockFractions, clockText, electronPoint, orbitHalves, bayAreaTime, tickPulse, type Hands, type Orbit } from '@/lib/atomic-clock'
import { CircuitRow, type CircuitTone } from './circuits'

type Hand = keyof Hands
const ORBITS: (Orbit & { hand: Hand; color: string; r: number })[] = [
  { rx: 150, ry: 46, rotate: 0, hand: 's', color: '#3ff0ff', r: 7 },
  { rx: 150, ry: 46, rotate: 60, hand: 'm', color: '#8bff6b', r: 8 },
  { rx: 150, ry: 46, rotate: -60, hand: 'h', color: '#ff4fd8', r: 9 },
]
/** Server render and first paint: the classic watch-ad pose, 10:10:30. */
const POSE = clockFractions(new Date(2000, 0, 1, 10, 10, 30))
/** Digit pairs are coloured like the electron that is that hand: hours, minutes, seconds. */
const HMS = [2, 2, 2] as const
const HAND_TONES: CircuitTone[] = ['magenta', 'green', 'cyan']
const TRAIL: Record<Hand, number> = { s: 16, m: 8, h: 6 }
const TRAIL_STEP = 0.011

const FLOW: Record<Hand, string> = { s: '1.6s', m: '2.6s', h: '3.8s' }

const glow = (c: string): CSSProperties => ({ filter: `drop-shadow(0 0 6px ${c})` })

function Electron({ orbit, fraction, layer }: { orbit: (typeof ORBITS)[number]; fraction: number; layer: 'back' | 'front' }) {
  const head = electronPoint(orbit, fraction)
  if ((head.z >= 0 ? 'front' : 'back') !== layer) return null
  const depth = (head.z + 1) / 2 // 0 far … 1 near
  return (
    <g data-electron={orbit.hand}>
      {Array.from({ length: TRAIL[orbit.hand] }, (_, i) => {
        const p = electronPoint(orbit, fraction - (i + 1) * TRAIL_STEP)
        return <circle key={i} cx={p.x} cy={p.y} r={orbit.r * Math.max(0.15, 0.8 - i * (0.65 / TRAIL[orbit.hand])) * (0.7 + 0.3 * depth)} fill={orbit.color} opacity={Math.max(0, 0.55 - i * (0.55 / TRAIL[orbit.hand])) * (0.4 + 0.6 * depth)} />
      })}
      <circle cx={head.x} cy={head.y} r={orbit.r * (0.7 + 0.3 * depth)} fill={orbit.color} opacity={0.45 + 0.55 * depth} style={glow(orbit.color)} />
    </g>
  )
}

/**
 * The kev.in atomic clock. Three electrons are clock hands for the reader's
 * local time: cyan laps once a minute, green once an hour, magenta every 12
 * hours. Rings pass behind the nucleus; the atom leans toward the pointer.
 */
export function AtomicClock({ size, className, layout = 'stack' }: { size: number; className?: string; layout?: 'stack' | 'row' }) {
  const [now, setNow] = useState<Date | null>(null)
  const [moving, setMoving] = useState(false)
  const frozen = useRef<Date | null>(null)
  const tilt = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const start = new Date()
    frozen.current = start
    setNow(start)
    if (reduce) {
      // Digits still tick; the electrons stay put.
      const id = setInterval(() => setNow(new Date()), 1000)
      return () => clearInterval(id)
    }
    setMoving(true)
    let raf = requestAnimationFrame(function tick() {
      setNow(new Date())
      raf = requestAnimationFrame(tick)
    })
    const lean = (e: PointerEvent) => {
      const el = tilt.current
      if (!el) return
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      el.style.transform = `perspective(800px) rotateX(${(-y * 16).toFixed(2)}deg) rotateY(${(x * 20).toFixed(2)}deg)`
    }
    window.addEventListener('pointermove', lean)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', lean)
    }
  }, [])

  const hands = now ? clockFractions(moving ? now : (frozen.current ?? now)) : POSE
  const pulse = moving && now ? tickPulse(now) : null
  const layer = (which: 'back' | 'front') =>
    ORBITS.map(o => {
      const { back, front } = orbitHalves(o)
      return (
        <g key={`${which}-${o.hand}`}>
          <path d={which === 'back' ? back : front} transform={`rotate(${o.rotate})`} fill="none" stroke={o.color} strokeWidth={2.5} opacity={which === 'back' ? 0.35 : 1} style={which === 'front' ? glow(o.color) : undefined} />
          <path d={which === 'back' ? back : front} transform={`rotate(${o.rotate})`} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" className="ring-flow" opacity={which === 'back' ? 0.25 : 0.8} style={{ animationDuration: FLOW[o.hand], ...(which === 'front' ? glow(o.color) : {}) }} />
        </g>
      )
    })

  return (
    <div className={`${layout === 'row' ? 'flex items-center gap-4' : ''} ${className ?? ''}`}>
      <div aria-hidden="true" ref={tilt} className="transition-transform duration-300 ease-out" style={{ width: size, height: size }}>
        <div className="tumble" style={{ width: size, height: size }}>
        <svg viewBox="-175 -175 350 350" width={size} height={size} style={{ overflow: 'visible' }}>
          {layer('back')}
          {ORBITS.map(o => (
            <Electron key={`b${o.hand}`} orbit={o} fraction={hands[o.hand]} layer="back" />
          ))}
          {pulse && (
            <>
              <circle r={pulse.r} fill="none" stroke="#ff6b35" strokeWidth={2} opacity={pulse.opacity} />
              <circle r={pulse.r * 0.62} fill="none" stroke="#ffb000" strokeWidth={1.5} opacity={pulse.opacity * 0.8} />
            </>
          )}
          <circle r={34} fill="#ff6b35" opacity={0.18} />
          <circle r={22} fill="#ff6b35" style={{ filter: 'drop-shadow(0 0 18px #ff6b35)' }} />
          {layer('front')}
          {ORBITS.map(o => (
            <Electron key={`f${o.hand}`} orbit={o} fraction={hands[o.hand]} layer="front" />
          ))}
        </svg>
        </div>
      </div>
      <div className={`flex flex-col gap-1.5 ${layout === 'row' ? 'items-start' : 'mt-3 items-center'}`} aria-hidden="true">
        <CircuitRow row="local" caption="LOCAL" captionMuted values={now ? clockText(now).split(':') : null} cols={HMS} tones={HAND_TONES} tone="cyan" />
        <CircuitRow row="bay-area" caption="BAY AREA" captionMuted values={now ? bayAreaTime(now).split(':') : null} cols={HMS} tones={HAND_TONES} tone="cyan" units={['HR', 'MIN', 'SEC']} />
      </div>
    </div>
  )
}
