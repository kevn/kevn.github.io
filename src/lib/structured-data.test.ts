import { PERSON_ID, WEBSITE_ID, SAME_AS, personSchema, websiteSchema, blogPostingSchema, breadcrumbSchema, faqFromMarkdown, workbenchListSchema, jsonLdString } from './structured-data'
import type { Post } from './posts'

const post = (over: Partial<Post> = {}): Post => ({
  slug: 'agents', url: '/writing/agents', title: 'Agents', dateRaw: '2026-10-01', date: { y: 2026, m: 10, d: 1 },
  kind: 'essay', draft: false, summary: 'A summary of the post.', tags: ['ai', 'agents'], format: 'mdx', body: 'code', ...over,
})

it('describes Kevin once, with every profile as sameAs', () => {
  const p = personSchema()
  expect(p['@id']).toBe(PERSON_ID)
  expect(p.name).toBe('Kevin Hunt')
  expect(SAME_AS).toEqual(['https://www.linkedin.com/in/kevinhunt/', 'https://github.com/kevn', 'https://www.deepfathom.ai/team/kevin-hunt', 'https://kevinhunt.com'])
  expect(p.sameAs).toEqual(SAME_AS)
  expect(p.worksFor).toMatchObject({ '@type': 'Organization', name: 'Deep Fathom', url: 'https://www.deepfathom.ai' })
  expect(JSON.stringify(p)).not.toMatch(/compliance|Defense/i)
})

it('ties the website to Kevin by @id', () => {
  expect(websiteSchema()).toMatchObject({ '@type': 'WebSite', '@id': WEBSITE_ID, url: 'https://kev.in', author: { '@id': PERSON_ID }, publisher: { '@id': PERSON_ID } })
})

it('marks up a post as a BlogPosting authored by Kevin', () => {
  const s = blogPostingSchema(post({ updated: { y: 2026, m: 11, d: 2 } }), { wordCount: 812 })
  expect(s).toMatchObject({
    '@type': 'BlogPosting', headline: 'Agents', url: 'https://kev.in/writing/agents', datePublished: '2026-10-01', dateModified: '2026-11-02',
    author: { '@id': PERSON_ID }, publisher: { '@id': PERSON_ID }, isPartOf: { '@id': WEBSITE_ID }, keywords: 'ai, agents', wordCount: 812,
    image: 'https://kev.in/writing/agents/opengraph-image', mainEntityOfPage: 'https://kev.in/writing/agents', inLanguage: 'en-US',
  })
  expect(blogPostingSchema(post(), { wordCount: 1 }).dateModified).toBe('2026-10-01')
})

it('builds breadcrumbs with absolute URLs', () => {
  expect(breadcrumbSchema([['Home', '/'], ['Writing', '/writing']]).itemListElement).toEqual([
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kev.in/' },
    { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://kev.in/writing' },
  ])
})

it('turns question headings into an FAQPage, but only when most H2s are questions', () => {
  const md = '## What is Machine Mode?\n\nA standard for agent-operable tools.\n\nMore detail.\n\n## Why now?\n\nAgents are here.\n'
  expect(faqFromMarkdown(md)).toMatchObject({ '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'What is Machine Mode?', acceptedAnswer: { '@type': 'Answer', text: 'A standard for agent-operable tools. More detail.' } }, { name: 'Why now?' }] })
  expect(faqFromMarkdown('## Setup\n\ntext\n\n## Results\n\nmore\n\n## Why?\n\nx')).toBeNull()
})

it('lists workbench projects with their status and start year', () => {
  const s = workbenchListSchema([{ slug: 'x', name: 'X', hook: 'Does x.', started: 2020, updated: '2026-01', status: 'MOTHBALLED', href: 'https://x.dev' }])
  expect(s.itemListElement[0]).toMatchObject({ position: 1, item: { '@type': 'CreativeWork', name: 'X', description: 'Does x.', dateCreated: '2020', creativeWorkStatus: 'Mothballed', url: 'https://x.dev', creator: { '@id': PERSON_ID } } })
})

it('serialises safely for a <script> tag', () => {
  expect(jsonLdString({ a: '</script><script>alert(1)</script>' })).not.toContain('</script>')
})
