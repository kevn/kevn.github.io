import { render, screen } from '@testing-library/react'
import { SiteNav } from './site-nav'
import { SiteFooter } from './site-footer'
import { PROJECTS } from '@/data/projects'

it('nav links to every section, home and email', () => {
  render(<SiteNav />)
  for (const [name, href] of [
    ['Writing', '/writing'],
    ['Side', '/side'],
    ['Sights', '/sights'],
    ['Now', '/now'],
  ])
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
  expect(screen.getByRole('link', { name: /hi@kev\.in/ })).toHaveAttribute('href', 'mailto:hi@kev.in')
  expect(screen.getByRole('link', { name: 'kev.in home' })).toHaveAttribute('href', '/')
})

it('footer offers email', () => {
  render(<SiteFooter />)
  expect(screen.getByRole('link', { name: /hi@kev\.in/ })).toHaveAttribute('href', 'mailto:hi@kev.in')
})

it('lists the four headline projects with real links', () => {
  expect(PROJECTS.map(p => p.slug)).toEqual(['deep-fathom', 'rival-bear', 'fpv', 'terrain'])
  PROJECTS.forEach(p => expect(p.href).toMatch(/^(https:\/\/|\/)/))
})
