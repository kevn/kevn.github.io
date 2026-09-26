import { render, screen } from '@testing-library/react'
import { Wordmark } from './wordmark'

it('exposes an accessible name and scales to the requested size', () => {
  render(<Wordmark size={100} />)
  const img = screen.getByRole('img', { name: 'kev.in' })
  expect(img.getAttribute('height')).toBe('100')
})

it('renders two instances without clashing ids', () => {
  const { container } = render(
    <>
      <Wordmark size={30} />
      <Wordmark size={60} />
    </>,
  )
  const ids = [...container.querySelectorAll('[id]')].map(e => e.id)
  expect(ids.length).toBeGreaterThan(0)
  expect(new Set(ids).size).toBe(ids.length)
})
