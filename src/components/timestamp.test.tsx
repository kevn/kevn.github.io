import { render, screen, act } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { TimeStamp, toSeg, ghostOf } from './timestamp'
import { Readout } from './readout'

afterEach(() => vi.useRealTimers())

const pin = () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 26, 12))
}
const windows = (row: string) => [...document.querySelectorAll(`[data-row="${row}"] [data-window]`)].map(w => w.querySelector('[data-lit]')!.textContent)

it('maps text to DSEG glyph strings of equal width', () => {
  expect(toSeg('MAY 17 2007')).toBe('MAY!17!2007')
  expect(ghostOf('MAY 17 2007')).toBe('~~~!~~!~~~~')
  expect(ghostOf('10:42:17')).toBe('~~:~~:~~')
})

it('shows WRITTEN as separate MONTH / DAY / YEAR windows', () => {
  render(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} />)
  expect(windows('written')).toEqual(['MAY', '17', '2007'])
})

it('fills NOW and a years / months / days ELAPSED readout on the client', async () => {
  pin()
  render(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} />)
  await act(async () => {})
  expect(windows('now')).toEqual(['SEP', '26', '2026'])
  expect(windows('elapsed')).toEqual(['!19', '04', '!!09'])
  expect(screen.getByText('Written May 17, 2007 — 19 years ago.', { exact: false })).toBeInTheDocument()
})

it('gives every row the same window widths, so the panel lines up', async () => {
  pin()
  const { container } = render(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} updated={{ y: 2008, m: 1, d: 2 }} />)
  await act(async () => {})
  const rows = [...container.querySelectorAll('[data-row]')].map(r => [...r.querySelectorAll('[data-window]')].map(w => w.getAttribute('data-chars')))
  expect(rows).toHaveLength(4)
  for (const r of rows) expect(r).toEqual(['3', '2', '4'])
})

it('shows DRAFT and no ELAPSED for drafts', async () => {
  render(<TimeStamp written={{ y: 2026, m: 10, d: 1 }} draft />)
  await act(async () => {})
  expect(document.body.textContent).toContain('DRAFT')
  expect(document.querySelector('[data-row="elapsed"]')).toBeNull()
})

it('never bakes the build date into NOW on the server', () => {
  pin()
  const html = renderToString(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} />)
  expect(html).toContain('WRITTEN')
  expect(html).not.toMatch(/>SEP</)
  expect(html).not.toMatch(/>!19</)
})

it('pads lit text to the ghost width so short values stay inside a readout', () => {
  const { container } = render(<Readout label="STATUS" text="LIVE" tone="cyan" ghostFor="ON THE BENCH" />)
  const [ghost, lit] = [...container.querySelectorAll('span span')].map(s => s.textContent ?? '')
  expect(lit).toBe('LIVE!!!!!!!!')
  expect(lit.length).toBe(ghost.length)
})
