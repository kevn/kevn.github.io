import { readdirSync } from 'node:fs'
import { indexNowKey, locsFromSitemap, payload } from './indexnow.mjs'

it('finds the hosted key file in public/', () => {
  const key = indexNowKey()
  expect(key).toMatch(/^[0-9a-f]{32}$/)
  expect(readdirSync('public')).toContain(`${key}.txt`)
})

it('extracts URLs from a sitemap', () => {
  expect(locsFromSitemap('<urlset><url><loc>https://kev.in/</loc></url><url><loc>https://kev.in/about</loc></url></urlset>')).toEqual(['https://kev.in/', 'https://kev.in/about'])
})

it('builds the IndexNow payload for kev.in', () => {
  expect(payload(['https://kev.in/a'], 'abc')).toEqual({ host: 'kev.in', key: 'abc', keyLocation: 'https://kev.in/abc.txt', urlList: ['https://kev.in/a'] })
})
