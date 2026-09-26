import { render, screen, act } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { TimeStamp, toSeg, ghostOf } from './timestamp'

afterEach(() => vi.useRealTimers())

it('maps text to DSEG glyph strings of equal width', () => {
  expect(toSeg('MAY 17 2007')).toBe('MAY!17!2007')
  expect(ghostOf('MAY 17 2007')).toBe('~~~!~~!~~~~')
})

it('renders WRITTEN and an accessible sentence', async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 26, 12))
  render(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} />)
  await act(async () => {})
  expect(document.body.textContent).toContain('MAY!17!2007')
  expect(screen.getByText('Written May 17, 2007 — 19 years ago.', { exact: false })).toBeInTheDocument()
})

it('fills NOW and ELAPSED on the client', async () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 26, 12))
  render(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} />)
  await act(async () => {})
  expect(document.body.textContent).toContain('SEP!26!2026')
  expect(document.body.textContent).toContain('19!YRS')
})

it('shows DRAFT status for drafts, and no ELAPSED', async () => {
  render(<TimeStamp written={{ y: 2026, m: 10, d: 1 }} draft />)
  await act(async () => {})
  expect(document.body.textContent).toContain('DRAFT')
  expect(document.body.textContent).not.toContain('ELAPSED')
})

it('never bakes the build date into NOW on the server', () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 26, 12))
  const html = renderToString(<TimeStamp written={{ y: 2007, m: 5, d: 17 }} />)
  expect(html).toContain('NOW')
  expect(html).toContain('MAY!17!2007')
  expect(html).not.toContain('SEP!26!2026')
  expect(html).not.toContain('YRS<')
})

it('pads lit text to the ghost width so short values stay inside the readout', async () => {
  const { Readout } = await import('./readout')
  const { container } = render(<Readout label="STATUS" text="LIVE" tone="cyan" ghostFor="ON THE BENCH" />)
  const [ghost, lit] = [...container.querySelectorAll('span span')].map(s => s.textContent ?? '')
  expect(lit).toBe('LIVE!!!!!!!!')
  expect(lit.length).toBe(ghost.length)
})

it('keeps colons as colons in ghost digits', () => {
  expect(ghostOf('10:42:17')).toBe('~~:~~:~~')
})
