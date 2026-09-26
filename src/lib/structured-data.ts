import { site } from './site'
import { KIND_LABEL, type Post } from './posts'
import type { CalendarDate } from './dates'
import type { WorkbenchItem, WorkbenchStatus } from '@/data/workbench'

/** One identity graph: every page and post points back to these @ids. */
export const PERSON_ID = `${site.url}/#person`
export const WEBSITE_ID = `${site.url}/#website`

export const SAME_AS = ['https://www.linkedin.com/in/kevinhunt/', 'https://github.com/kevn', 'https://www.deepfathom.ai/team/kevin-hunt', 'https://kevinhunt.com']

type Json = Record<string, unknown>
const abs = (path: string) => (path.startsWith('http') ? path : `${site.url}${path}`)
const iso = (c: CalendarDate) => `${c.y}-${String(c.m).padStart(2, '0')}-${String(c.d).padStart(2, '0')}`

export function personSchema(): Json {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Kevin Hunt',
    url: abs('/about'),
    email: `mailto:${site.email}`,
    jobTitle: 'Co-founder & CTO',
    worksFor: { '@type': 'Organization', name: 'Deep Fathom', url: 'https://www.deepfathom.ai', description: 'An AI-native cybersecurity platform for high-stakes environments.' },
    homeLocation: { '@type': 'Place', name: 'San Francisco Bay Area, California' },
    knowsAbout: ['Software engineering', 'AI agents', 'Engineering leadership', 'Cybersecurity', 'FPV drones', 'Geographic information systems', '3D terrain', 'Photography'],
    sameAs: SAME_AS,
  }
}

export function websiteSchema(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.url,
    name: site.name,
    alternateName: 'Kevin Hunt',
    description: site.description,
    inLanguage: 'en-US',
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  }
}

export function blogPostingSchema(post: Post, { wordCount }: { wordCount: number }): Json {
  const url = abs(post.url)
  const published = post.dateRaw.slice(0, 10)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: post.title,
    description: post.summary,
    url,
    mainEntityOfPage: url,
    datePublished: published,
    dateModified: post.updated ? iso(post.updated) : published,
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-US',
    articleSection: KIND_LABEL[post.kind].toLowerCase(),
    keywords: post.tags.join(', '),
    wordCount,
    image: `${url}/opengraph-image`,
  }
}

export function breadcrumbSchema(items: [name: string, path: string][]): Json & { itemListElement: Json[] } {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
  }
}

/** FAQPage from question-shaped H2s ("## Why now?"), when at least half the H2s are questions. */
export function faqFromMarkdown(md: string): Json | null {
  const sections = md.split(/^## /m).slice(1).map(s => {
    const [heading, ...rest] = s.split('\n')
    const answer = rest.join('\n').split(/^#{1,6} /m)[0].replace(/\s+/g, ' ').trim()
    return { heading: heading.trim(), answer }
  })
  const questions = sections.filter(s => /\?$/.test(s.heading) && s.answer)
  if (questions.length < 2 || questions.length * 2 < sections.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({ '@type': 'Question', name: q.heading, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
  }
}

const STATUS: Record<WorkbenchStatus, string> = { LIVE: 'Published', 'IN FLIGHT': 'Active', 'ON THE BENCH': 'Paused', MOTHBALLED: 'Mothballed' }

export function workbenchListSchema(items: WorkbenchItem[]): Json & { itemListElement: Json[] } {
  return {
    '@type': 'ItemList',
    name: 'On the workbench',
    itemListElement: items.map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: w.name,
        description: w.hook,
        dateCreated: String(w.started),
        creativeWorkStatus: STATUS[w.status],
        ...(w.href ? { url: abs(w.href) } : {}),
        creator: { '@id': PERSON_ID },
      },
    })),
  }
}

/** A @graph document, serialised for a native <script type="application/ld+json"> (escapes `<`). */
export function jsonLdString(data: Json | Json[]): string {
  const doc = Array.isArray(data) ? { '@context': 'https://schema.org', '@graph': data } : { '@context': 'https://schema.org', ...data }
  return JSON.stringify(doc).replace(/</g, '\\u003c')
}
