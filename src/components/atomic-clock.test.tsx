import { render, act } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { AtomicClock } from './atomic-clock'

afterEach(() => vi.useRealTimers())

it('never bakes the build time into the server render', () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 8, 26, 15, 42, 17))
  const html = renderToString(<AtomicClock size={200} />)
  expect(html).toContain('LOCAL')
  expect(html).toContain('BAY AREA')
  expect(html).not.toContain('15:42:17')
})

it('shows local and Bay Area time once mounted', async () => {
  vi.useFakeTimers({ toFake: ['Date', 'requestAnimationFrame', 'cancelAnimationFrame', 'setInterval', 'clearInterval'] })
  vi.setSystemTime(new Date(Date.UTC(2026, 8, 26, 17, 5, 7)))
  const { container } = render(<AtomicClock size={200} />)
  await act(async () => {})
  const text = container.textContent ?? ''
  expect(text).toContain('10:05:07')
})

it('draws three electrons and keeps the visual out of the accessibility tree', () => {
  const { container } = render(<AtomicClock size={200} />)
  const svg = container.querySelector('svg')!
  expect(svg.closest('[aria-hidden="true"]')).not.toBeNull()
  expect(container.querySelectorAll('[data-electron]')).toHaveLength(3)
})
