import { render } from '@testing-library/react'
import { Sparkle, Starburst, Atom } from './ornaments'

it('keeps decoration out of the accessibility tree', () => {
  const { container } = render(
    <>
      <Sparkle size={20} color="#3ff0ff" />
      <Starburst size={40} color="#ff6b35" />
      <Atom size={200} />
    </>,
  )
  const svgs = container.querySelectorAll('svg')
  expect(svgs.length).toBeGreaterThanOrEqual(3)
  svgs.forEach(s => expect(s.closest('[aria-hidden="true"]')).not.toBeNull())
})

it('draws a 16-ray starburst', () => {
  const { container } = render(<Starburst size={40} color="#ff6b35" />)
  expect(container.querySelectorAll('line')).toHaveLength(16)
})
