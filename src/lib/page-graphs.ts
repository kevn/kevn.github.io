import { PROJECTS } from '@/data/projects'
import { WORKBENCH, shelf } from '@/data/workbench'
import { HERO_BIO } from '@/data/bio'
import { postBody } from './page-markdown'
import type { Post } from './posts'
import { site } from './site'
import { PERSON_ID, WEBSITE_ID, blogPostingSchema, breadcrumbSchema, faqFromMarkdown, personSchema, websiteSchema, workbenchListSchema } from './structured-data'

type Node = Record<string, unknown>
const page = (type: string, path: string, name: string, extra: Node = {}): Node => ({
  '@type': type,
  '@id': `${site.url}${path}#webpage`,
  url: `${site.url}${path}`,
  name,
  isPartOf: { '@id': WEBSITE_ID },
  inLanguage: 'en-US',
  ...extra,
})

const words = (text: string) => text.replace(/[#*_`>\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length

export const homeGraph = (): Node[] => [
  websiteSchema(),
  personSchema(),
  page('WebPage', '/', 'Kevin Hunt · kev.in', {
    description: HERO_BIO,
    about: { '@id': PERSON_ID },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hero-bio'] },
  }),
]

export const aboutGraph = (updated: string): Node[] => [
  page('ProfilePage', '/about', 'About Kevin Hunt', { mainEntity: { '@id': PERSON_ID }, dateModified: updated }),
  personSchema(),
  breadcrumbSchema([['Home', '/'], ['About', '/about']]),
]

export const writingGraph = (posts: Post[]): Node[] => [
  page('CollectionPage', '/writing', 'Writing', {
    about: { '@id': PERSON_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}${p.url}`, name: p.title })),
    },
  }),
  breadcrumbSchema([['Home', '/'], ['Writing', '/writing']]),
]

export function postGraph(post: Post): Node[] {
  const body = postBody(post)
  const faq = post.format === 'mdx' ? faqFromMarkdown(body) : null
  return [
    blogPostingSchema(post, { wordCount: words(body) }),
    breadcrumbSchema([['Home', '/'], ['Writing', '/writing'], [post.title, post.url]]),
    ...(faq ? [faq] : []),
  ]
}

export const progressGraph = (): Node[] => [
  page('CollectionPage', '/progress', "What I'm building", {
    about: { '@id': PERSON_ID },
    hasPart: PROJECTS.map(p => ({ '@type': 'Organization', name: p.name, url: p.href, description: p.blurb })),
    mainEntity: workbenchListSchema(shelf(WORKBENCH)),
  }),
  breadcrumbSchema([['Home', '/'], ['Progress', '/progress']]),
]

export const sightsGraph = (): Node[] => [
  page('WebPage', '/sights', 'Sights', { about: { '@id': PERSON_ID }, relatedLink: 'https://kevinhunt.com' }),
  breadcrumbSchema([['Home', '/'], ['Sights', '/sights']]),
]
