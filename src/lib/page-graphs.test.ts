import { homeGraph, aboutGraph, writingGraph, postGraph, progressGraph } from './page-graphs'
import { PERSON_ID, WEBSITE_ID } from './structured-data'
import { getPost, getPosts } from './posts'

const types = (g: Record<string, unknown>[]) => g.map(n => n['@type'])

it('home: website, person and a speakable web page about Kevin', () => {
  const g = homeGraph()
  expect(types(g)).toEqual(['WebSite', 'Person', 'WebPage'])
  expect(g[2]).toMatchObject({ isPartOf: { '@id': WEBSITE_ID }, about: { '@id': PERSON_ID }, speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hero-bio'] } })
})

it('about: a ProfilePage whose main entity is Kevin', () => {
  const g = aboutGraph('2026-09-26')
  expect(types(g)).toEqual(['ProfilePage', 'Person', 'BreadcrumbList'])
  expect(g[0]).toMatchObject({ mainEntity: { '@id': PERSON_ID }, dateModified: '2026-09-26' })
})

it('writing: a collection listing every post', () => {
  const g = writingGraph(getPosts())
  expect(types(g)).toEqual(['CollectionPage', 'BreadcrumbList'])
  const list = (g[0] as { mainEntity: { itemListElement: unknown[] } }).mainEntity
  expect(list.itemListElement).toHaveLength(getPosts().length)
})

it('post: a BlogPosting with a real word count and breadcrumbs', () => {
  const g = postGraph(getPost('railsconf-07-day-0')!)
  expect(types(g)).toEqual(['BlogPosting', 'BreadcrumbList'])
  expect((g[0] as { wordCount: number }).wordCount).toBeGreaterThan(100)
})

it('progress: a collection of Deep Fathom, Rival Bear and the workbench', () => {
  const g = progressGraph()
  expect(types(g)).toEqual(['CollectionPage', 'BreadcrumbList'])
  expect(JSON.stringify(g)).toContain('Mothballed')
  expect(JSON.stringify(g)).toContain('"name":"Deep Fathom"')
})
