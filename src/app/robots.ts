import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/** AI search, answer and training crawlers — all explicitly welcome (maximum GEO). */
export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'meta-externalagent',
  'meta-externalfetcher',
  'Amazonbot',
  'CCBot',
  'cohere-ai',
  'MistralAI-User',
  'DuckAssistBot',
]

/** Only production is indexable; preview deployments ask every crawler to stay out. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== 'production') return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/feed.xml`],
  }
}
