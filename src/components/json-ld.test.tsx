import { render } from '@testing-library/react'
import { JsonLd } from './json-ld'

it('renders a native ld+json script with @context and a @graph', () => {
  const { container } = render(<JsonLd graph={[{ '@type': 'Thing', name: '<b>' }]} />)
  const script = container.querySelector('script[type="application/ld+json"]')!
  const doc = JSON.parse(script.innerHTML)
  expect(doc['@context']).toBe('https://schema.org')
  expect(doc['@graph'][0].name).toBe('<b>')
  expect(script.innerHTML).not.toContain('<b>')
})
