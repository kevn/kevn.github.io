import { render, screen } from '@testing-library/react'
import { WorkbenchCard } from './workbench-card'

it('shows name, hook and an accessible started/status sentence', () => {
  render(<WorkbenchCard item={{ slug: 'x', name: 'Waterdog trail map', hook: 'A trail map.', started: 2020, updated: '2026-05', status: 'IN FLIGHT' }} />)
  expect(screen.getByRole('heading', { name: 'Waterdog trail map' })).toBeInTheDocument()
  expect(screen.getByText('Started 2020. Status: in flight.')).toBeInTheDocument()
})

it('links out only when the project has a public home', () => {
  const { rerender } = render(<WorkbenchCard item={{ slug: 'x', name: 'X', hook: '', started: 2020, updated: '2026-05', status: 'LIVE', href: 'https://machinemode.io' }} />)
  expect(screen.getByRole('link')).toHaveAttribute('href', 'https://machinemode.io')
  rerender(<WorkbenchCard item={{ slug: 'y', name: 'Y', hook: '', started: 2020, updated: '2026-05', status: 'LIVE' }} />)
  expect(screen.queryByRole('link')).toBeNull()
})
