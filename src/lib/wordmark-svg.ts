import { WORDMARKS } from '@/components/wordmark-data'

export const BAND_COLORS = ['#ff4fd8', '#7b6cff', '#3ff0ff', '#8bff6b'] as const
export type WordmarkText = keyof typeof WORDMARKS

/** Band geometry in path units (the glyphs are set at size 100): four bands per BAND_PERIOD, a thin gap every GAP_PERIOD. */
export const BAND_PERIOD = 36
export const GAP_PERIOD = 9
export const GAP = 2.2

export interface Row {
  y: number
  h: number
  fill: string
}

/** Colour bands covering [−BAND_PERIOD, height + BAND_PERIOD) so a one-period slide loops seamlessly. */
export function bandRows(height: number): Row[] {
  const rows: Row[] = []
  for (let y = -BAND_PERIOD; y < height + BAND_PERIOD; y += BAND_PERIOD)
    BAND_COLORS.forEach((fill, i) => rows.push({ y: y + (i * BAND_PERIOD) / 4, h: BAND_PERIOD / 4, fill }))
  return rows
}

export function gapRows(height: number): Row[] {
  const rows: Row[] = []
  for (let y = GAP_PERIOD - GAP; y < height; y += GAP_PERIOD) rows.push({ y, h: GAP, fill: '#000' })
  return rows
}

const rect = (r: Row, width: number) => `<rect x="0" y="${+r.y.toFixed(2)}" width="${width}" height="${r.h}" fill="${r.fill}"/>`

/** Static, standalone banded wordmark SVG (share images, icons). */
export function wordmarkSvg(text: WordmarkText, opts: { height?: number } = {}): string {
  const { d, width, height } = WORDMARKS[text]
  const h = opts.height ?? height
  const w = +((width / height) * h).toFixed(2)
  const bands = bandRows(height).map(r => rect(r, width)).join('')
  const gaps = gapRows(height).map(r => rect(r, width)).join('')
  const id = `wm-${text.replace(/[^a-z]/g, '')}-${Math.round(h)}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${w}" height="${h}"><defs><clipPath id="${id}c"><path d="${d}"/></clipPath><mask id="${id}m"><rect width="${width}" height="${height}" fill="#fff"/>${gaps}</mask></defs><g clip-path="url(#${id}c)" mask="url(#${id}m)">${bands}</g></svg>`
}
