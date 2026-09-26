import robots, { AI_CRAWLERS } from './robots'
import sitemap from './sitemap'

afterEach(() => vi.unstubAllEnvs())

it('welcomes every crawler, including AI search and training bots, in production', () => {
  vi.stubEnv('VERCEL_ENV', 'production')
  const r = robots()
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules]
  expect(rules).toContainEqual({ userAgent: '*', allow: '/' })
  for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']) expect(AI_CRAWLERS).toContain(bot)
  expect(rules).toContainEqual({ userAgent: AI_CRAWLERS, allow: '/' })
  expect(r.sitemap).toEqual(['https://kev.in/sitemap.xml', 'https://kev.in/feed.xml'])
})

it('keeps previews out of every index', () => {
  vi.stubEnv('VERCEL_ENV', 'preview')
  expect(robots().rules).toEqual({ userAgent: '*', disallow: '/' })
})

it('gives the sitemap real lastmod dates only where content changed', () => {
  const entries = sitemap()
  const about = entries.find(e => e.url === 'https://kev.in/about')!
  expect(about.lastModified).toBe('2026-09-26')
  expect(entries.find(e => e.url === 'https://kev.in/writing/railsconf-07-day-0')!.lastModified).toBe('2007-05-17')
  expect(entries.find(e => e.url === 'https://kev.in/progress')!.lastModified).toBeUndefined()
})
