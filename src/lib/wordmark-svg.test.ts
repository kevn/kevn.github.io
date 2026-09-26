import { wordmarkSvg, BAND_COLORS } from './wordmark-svg'

it('builds a standalone banded SVG at the requested height', () => {
  const svg = wordmarkSvg('kev.in', { height: 120 })
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
  for (const c of BAND_COLORS) expect(svg).toContain(c)
  expect(svg).toContain('height="120"')
})

it('uses ids that differ between texts and sizes, so inline SVGs never share clip paths', () => {
  const ids = (svg: string) => [...svg.matchAll(/ id="([^"]+)"/g)].map(m => m[1])
  const a = ids(wordmarkSvg('kev.in', { height: 120 }))
  const b = ids(wordmarkSvg('hi@kev.in', { height: 90 }))
  expect(a.length).toBe(2)
  expect(a.filter(x => b.includes(x))).toEqual([])
})
