import { site } from './site'

it('describes the canonical site', () => {
  expect(site.url).toBe('https://kev.in')
  expect(site.name).toBe('kev.in')
  expect(site.email).toBe('hi@kev.in')
})
