import { test, expect, type APIRequestContext } from '@playwright/test'

// Crawl every URL in the sitemap and hold each page to the SEO/GEO bar.
async function sitemapPaths(request: APIRequestContext) {
  const xml = await (await request.get('/sitemap.xml')).text()
  return [...xml.matchAll(/<loc>https:\/\/kev\.in([^<]*)<\/loc>/g)].map(m => m[1] || '/')
}

test('every sitemap page meets the SEO/GEO bar', async ({ page, request }) => {
  test.setTimeout(180_000)
  const paths = await sitemapPaths(request)
  expect(paths.length).toBeGreaterThan(20)
  const problems: string[] = []
  const internal = new Set<string>()
  for (const path of paths) {
    await page.goto(path)
    const info = await page.evaluate(() => {
      const meta = (sel: string) => document.querySelector(sel)?.getAttribute('content') ?? ''
      return {
        title: document.title,
        description: meta('meta[name="description"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
        ogTitle: meta('meta[property="og:title"]'),
        ogImage: meta('meta[property="og:image"]'),
        ogUrl: meta('meta[property="og:url"]'),
        twitter: meta('meta[name="twitter:card"]'),
        h1s: document.querySelectorAll('h1').length,
        h1: document.querySelector('h1')?.textContent?.trim() ?? '',
        lang: document.documentElement.lang,
        markdown: document.querySelector('link[rel="alternate"][type="text/markdown"]')?.getAttribute('href') ?? '',
        ldjson: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent ?? ''),
        links: [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')!.split('#')[0]),
        imgsWithoutAlt: [...document.querySelectorAll('img:not([alt])')].length,
      }
    })
    const url = `https://kev.in${path === '/' ? '' : path}`
    const p = (msg: string) => problems.push(`${path}: ${msg}`)
    // Over 70 only when it's the post's own (historical) title, verbatim.
    if (info.title.length < 15 || (info.title.length > 70 && info.title !== info.h1)) p(`title length ${info.title.length} "${info.title}"`)
    if (info.description.length < 50 || info.description.length > 160) p(`description length ${info.description.length}`)
    if (info.canonical !== url && info.canonical !== `${url}/`) p(`canonical ${info.canonical}`)
    if (info.ogUrl !== info.canonical) p(`og:url ${info.ogUrl} != canonical`)
    if (!info.ogTitle || !info.ogImage) p('missing og:title/og:image')
    if (info.twitter !== 'summary_large_image') p('twitter:card')
    if (info.h1s !== 1) p(`${info.h1s} h1s`)
    if (info.lang !== 'en') p('lang')
    if (info.imgsWithoutAlt) p(`${info.imgsWithoutAlt} img without alt`)
    if (info.ldjson.length === 0) p('no JSON-LD')
    for (const raw of info.ldjson) {
      try {
        const doc = JSON.parse(raw)
        if (doc['@context'] !== 'https://schema.org') p('JSON-LD @context')
      } catch {
        p('JSON-LD does not parse')
      }
    }
    if (!info.markdown) p('no Markdown alternate')
    else {
      const md = await request.get(info.markdown.replace('https://kev.in', ''))
      if (md.status() !== 200 || !md.headers()['content-type']?.includes('text/markdown')) p(`markdown twin ${info.markdown} → ${md.status()}`)
    }
    info.links.forEach(l => l && internal.add(l))
  }
  for (const link of internal) {
    const res = await request.get(link)
    if (res.status() >= 400) problems.push(`broken internal link ${link} → ${res.status()}`)
  }
  expect(problems).toEqual([])
})

test('answer engines can fetch Markdown by content negotiation', async ({ request }) => {
  for (const path of ['/', '/about', '/writing/railsconf-07-day-0']) {
    const res = await request.get(path, { headers: { accept: 'text/markdown' } })
    expect(res.headers()['content-type']).toContain('text/markdown')
    expect(await res.text()).toMatch(/^---\ntitle: /)
  }
})

test('llms.txt, ai.txt and the IndexNow key are served', async ({ request }) => {
  const llms = await (await request.get('/llms.txt')).text()
  expect(llms).toMatch(/^# Kevin Hunt/)
  expect(llms).toContain('## Writing')
  expect(await (await request.get('/ai.txt')).text()).toContain('Allow-AI-Search: /')
  const full = await (await request.get('/llms-full.txt')).text()
  expect(full.length).toBeGreaterThan(20_000)
  expect(full).not.toMatch(/&#x|<p>/)
})
