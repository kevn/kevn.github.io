import { render } from '@testing-library/react'
import { pages } from '#site/content'
import { PROJECTS } from '@/data/projects'
import { SiteFooter } from '@/components/site-footer'

it('describes Deep Fathom as cybersecurity for high-stakes environments', () => {
  const df = PROJECTS.find(p => p.slug === 'deep-fathom')!
  expect(df.blurb).toMatch(/cybersecurity/i)
  expect(df.blurb).toMatch(/high-stakes/i)
  const about = pages.find(p => p.path.endsWith('about'))!.code
  for (const text of [df.blurb, about]) expect(text).not.toMatch(/compliance|Defense Industrial/i)
})

it('keeps domain-ownership brags off the site', () => {
  const { container } = render(<SiteFooter />)
  expect(container.textContent).not.toMatch(/2005/)
  expect(pages.find(p => p.path.endsWith('about'))!.code).not.toMatch(/since 2005/)
})
