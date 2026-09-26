import type { MetadataRoute } from 'next'
import { pages } from '#site/content'
import { getPosts } from '@/lib/posts'
import { site } from '@/lib/site'

const ymd = (c: { y: number; m: number; d: number }) => `${c.y}-${String(c.m).padStart(2, '0')}-${String(c.d).padStart(2, '0')}`

/** lastmod only where content has a real date — never the build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  const about = pages.find(p => p.path.endsWith('about'))
  const index = ['', '/writing', '/progress', '/sights'].map(p => ({ url: `${site.url}${p}` }))
  const posts = getPosts()
    .filter(p => !p.draft)
    .map(p => ({ url: `${site.url}${p.url}`, lastModified: p.updated ? ymd(p.updated) : p.dateRaw.slice(0, 10) }))
  return [...index, { url: `${site.url}/about`, lastModified: about?.updated.slice(0, 10) }, ...posts]
}
