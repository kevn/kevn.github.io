import { clockFractions, electronPoint, orbitHalves, bayAreaTime, clockText } from './atomic-clock'

const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1e-9)

it('maps a time to hour, minute and second fractions of a lap', () => {
  const f = clockFractions(new Date(2026, 8, 26, 15, 30, 45, 500))
  close(f.s, 45.5 / 60)
  close(f.m, (30 + 45.5 / 60) / 60)
  close(f.h, (3 + 30 / 60 + 45.5 / 3600) / 12)
})

it('starts each lap at the top of the orbit and brings the electron toward the viewer halfway round', () => {
  const orbit = { rx: 100, ry: 30, rotate: 0 }
  const top = electronPoint(orbit, 0)
  close(top.x, 0)
  close(top.y, -30)
  close(top.z, -1)
  const quarter = electronPoint(orbit, 0.25)
  close(quarter.x, 100)
  close(quarter.y, 0)
  const half = electronPoint(orbit, 0.5)
  close(half.y, 30)
  close(half.z, 1)
})

it('rotates electrons with their orbit', () => {
  const p = electronPoint({ rx: 100, ry: 30, rotate: 90 }, 0.25)
  close(p.x, 0)
  close(p.y, 100)
})

it('splits an orbit into a back (far) arc and a front (near) arc', () => {
  const { back, front } = orbitHalves({ rx: 100, ry: 30, rotate: 0 })
  expect(back).toBe('M -100 0 A 100 30 0 0 1 100 0')
  expect(front).toBe('M 100 0 A 100 30 0 0 1 -100 0')
})

it('formats clock text and Bay Area time', () => {
  expect(clockText(new Date(2026, 8, 26, 9, 5, 7))).toBe('09:05:07')
  expect(bayAreaTime(new Date(Date.UTC(2026, 8, 26, 17, 5, 7)))).toBe('10:05:07')
})
