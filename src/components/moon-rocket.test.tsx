import { render } from '@testing-library/react'
import { MoonRocket } from './moon-rocket'

it('draws the man in the moon: a face that is struck in the eye', () => {
  const { container } = render(<MoonRocket />)
  const svg = container.querySelector('svg')!
  expect(svg).toHaveAttribute('aria-hidden', 'true')
  // an animated face (smiles, then winces on impact) and a still, wincing face for reduced motion
  expect(container.querySelectorAll('[data-face]')).toHaveLength(2)
  expect(container.querySelector('[data-face="animated"] [data-part="mouth"] animate')).not.toBeNull()
  expect(container.querySelector('[data-face="still"] [data-part="mouth"] animate')).toBeNull()
  for (const part of ['brow', 'eye', 'nose', 'mouth']) expect(container.querySelector(`[data-face="still"] [data-part="${part}"]`)).not.toBeNull()
})

it('lands the rocket in the moon’s eye', () => {
  const { container } = render(<MoonRocket />)
  const lodged = container.querySelector('[data-rocket="lodged"]')!
  expect(lodged.getAttribute('transform')).toMatch(/^translate\(1120 188\)/)
  const hitEye = container.querySelector('[data-face="still"] [data-part="struck-eye"]')!
  expect(Number(hitEye.getAttribute('cx'))).toBeCloseTo(1160, -1)
})
