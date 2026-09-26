/** Geometry and time for the atomic clock: each electron is a clock hand on a tilted orbit. */

export interface Orbit {
  /** Radii of the orbit as seen on screen (ry < rx: the ring is tilted away from the viewer). */
  rx: number
  ry: number
  /** In-plane rotation of the ring, degrees. */
  rotate: number
}

export interface Hands {
  h: number
  m: number
  s: number
}

/** Fractions of a lap: seconds per minute, minutes per hour, hours per 12. */
export function clockFractions(d: Date): Hands {
  const s = d.getSeconds() + d.getMilliseconds() / 1000
  const m = d.getMinutes() + s / 60
  const h = (d.getHours() % 12) + m / 60
  return { h: h / 12, m: m / 60, s: s / 60 }
}

/**
 * Electron position for a lap fraction. Fraction 0 is the top of the ring
 * (the far side, z = -1); 0.5 is the bottom (the near side, z = +1).
 */
export function electronPoint(orbit: Orbit, fraction: number): { x: number; y: number; z: number } {
  const t = 2 * Math.PI * fraction - Math.PI / 2
  const lx = orbit.rx * Math.cos(t)
  const ly = orbit.ry * Math.sin(t)
  const a = (orbit.rotate * Math.PI) / 180
  return { x: lx * Math.cos(a) - ly * Math.sin(a), y: lx * Math.sin(a) + ly * Math.cos(a), z: Math.sin(t) }
}

/** The ring as two arcs in its own (unrotated) frame: the far half passes behind the nucleus. */
export function orbitHalves(orbit: Orbit): { back: string; front: string } {
  const { rx, ry } = orbit
  return {
    back: `M ${-rx} 0 A ${rx} ${ry} 0 0 1 ${rx} 0`,
    front: `M ${rx} 0 A ${rx} ${ry} 0 0 1 ${-rx} 0`,
  }
}

const two = (n: number) => String(n).padStart(2, '0')

export const clockText = (d: Date) => `${two(d.getHours())}:${two(d.getMinutes())}:${two(d.getSeconds())}`

const SIERRA = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

export const sierraTime = (d: Date) => SIERRA.format(d)
