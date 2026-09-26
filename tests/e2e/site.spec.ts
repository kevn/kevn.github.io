import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = ['/', '/writing', '/writing/railsconf-07-day-0', '/side', '/sights', '/now']

// Vercel analytics scripts 404 outside Vercel; those errors aren't ours.
const ours = (errors: string[]) => errors.filter(e => !/_vercel|insights|speed-insights|Web Analytics/i.test(e))

for (const path of PAGES) {
  test(`${path} renders cleanly`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', m => m.type() === 'error' && errors.push(`${m.text()} ${m.location().url}`))
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(page.getByRole('link', { name: 'kev.in home' })).toBeVisible()
    await page.waitForLoadState('networkidle')
    expect(ours(errors)).toEqual([])
  })
}

test('home shows then/now stamps that fill in', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/Written \w+ \d+, 200\d — \d+ years ago\./).first()).toBeAttached()
})

test('unknown pages show the moon', async ({ page }) => {
  const res = await page.goto('/definitely-not-here')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'This page flew off course.' })).toBeVisible()
})

for (const [from, to] of [
  ['/2007/05/17/railsconf-07-day-0.html', '/writing/railsconf-07-day-0'],
  ['/2007/08/01/announcing-dibs-net', '/writing/announcing-dibs-net'],
  ['/page3.html', '/writing'],
  ['/tags/rails.html', '/writing'],
  ['/atom.xml', '/feed.xml'],
]) {
  test(`redirects ${from}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(res.headers()['location']).toBe(to)
  })
}

test('feed is RSS', async ({ request }) => {
  const res = await request.get('/feed.xml')
  expect(res.headers()['content-type']).toContain('rss+xml')
  expect(await res.text()).toMatch(/^<\?xml/)
})

for (const path of ['/', '/writing', '/writing/railsconf-07-day-0', '/now']) {
  test(`${path} has no serious a11y violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)
    const results = await new AxeBuilder({ page }).analyze()
    const bad = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
    expect(bad.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([])
  })
}

test('no horizontal scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  for (const path of [...PAGES, '/nope']) {
    await page.goto(path)
    expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBeLessThanOrEqual(360)
  }
})

test('reduced motion stops CSS animation', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('/')
  const running = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)
  expect(running).toBe(0)
  await ctx.close()
})
