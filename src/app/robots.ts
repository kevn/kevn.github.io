import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/** Only production is indexable; preview deployments ask crawlers to stay out. */
export default function robots(): MetadataRoute.Robots {
  const production = process.env.VERCEL_ENV === 'production'
  return {
    rules: production ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
