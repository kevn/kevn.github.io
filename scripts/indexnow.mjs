// Tell IndexNow engines (Bing, Yandex, Seznam, Naver…) about every URL in the
// live sitemap. Google reads the sitemap itself. Dry run unless INDEXNOW_SUBMIT=true.
//   pnpm indexnow                       # dry run against https://kev.in
//   INDEXNOW_SUBMIT=true pnpm indexnow  # submit (run after a production deploy)
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOST = 'kev.in'

export function indexNowKey() {
  const file = readdirSync(join(process.cwd(), 'public')).find(f => /^[0-9a-f]{32}\.txt$/.test(f))
  if (!file) throw new Error('No IndexNow key file (32 hex chars .txt) in public/')
  return file.replace('.txt', '')
}

export const locsFromSitemap = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim())

export const payload = (urlList, key) => ({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList })

async function main() {
  const site = process.env.SITE_URL ?? `https://${HOST}`
  const res = await fetch(`${site}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap ${res.status}`)
  const urls = locsFromSitemap(await res.text()).filter(u => u.startsWith(`https://${HOST}`))
  const body = payload(urls, indexNowKey())
  if (process.env.INDEXNOW_SUBMIT !== 'true') {
    console.log(`[dry run] would submit ${urls.length} URLs to IndexNow for ${HOST}`)
    return
  }
  const post = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) })
  console.log(`IndexNow: ${post.status} ${post.statusText} (${urls.length} URLs)`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch(e => { console.error(e); process.exit(1) })
