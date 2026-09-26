import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/writing', '/progress', '/sights', '/about'].map(p => ({ url: `${site.url}${p}` }))
  const posts = getPosts()
    .filter(p => !p.draft)
    .map(p => ({ url: `${site.url}${p.url}`, lastModified: p.dateRaw.slice(0, 10) }))
  return [...pages, ...posts]
}
