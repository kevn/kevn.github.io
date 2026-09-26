import { writing, archive } from '#site/content'
import { calendarDate, type CalendarDate } from './dates'

export type PostKind = 'essay' | 'build-log' | 'field-notes' | 'archive'

export interface Post {
  slug: string
  url: string
  title: string
  dateRaw: string
  date: CalendarDate
  updated?: CalendarDate
  kind: PostKind
  draft: boolean
  summary: string
  tags: string[]
  /** `mdx`: body is Velite-compiled MDX code. `html`: body is HTML. */
  format: 'mdx' | 'html'
  body: string
  /** MDX posts: static HTML of the body for feeds. */
  feedHtml?: string
  /** MDX posts: the raw Markdown/MDX source, for Markdown twins and llms-full.txt. */
  source?: string
}

export const KIND_LABEL: Record<PostKind, string> = {
  essay: 'ESSAY',
  'build-log': 'BUILD LOG',
  'field-notes': 'FIELD NOTES',
  archive: 'ARCHIVE',
}

export const slugFromPath = (path: string) => path.split('/').pop()!.replace(/^\d{4}-\d{2}-\d{2}-/, '')

export const includeDrafts = (env: string | undefined = process.env.VERCEL_ENV) => env !== 'production'

const plain = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const clip = (s: string, n = 160) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…')

export function selectPosts(all: Post[], env?: string): Post[] {
  const allow = includeDrafts(env)
  return all.filter(p => allow || !p.draft).sort((a, b) => b.dateRaw.localeCompare(a.dateRaw))
}

/** New writing first (newest first), then archive posts fill any remaining slots. */
export function homeDispatches(posts: Post[], n = 3): Post[] {
  const fresh = posts.filter(p => p.kind !== 'archive')
  const old = posts.filter(p => p.kind === 'archive')
  return [...fresh, ...old].slice(0, n)
}

export function assertUniqueSlugs(posts: Post[]): void {
  const seen = new Set<string>()
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`Duplicate post slug: ${p.slug}`)
    seen.add(p.slug)
  }
}

function fromVelite(): Post[] {
  const fresh: Post[] = writing.map(e => {
    const slug = slugFromPath(e.path)
    return {
      slug,
      url: `/writing/${slug}`,
      title: e.title,
      dateRaw: e.date,
      date: calendarDate(e.date),
      updated: e.updated ? calendarDate(e.updated) : undefined,
      kind: e.kind,
      draft: e.draft,
      summary: e.summary ?? clip(plain(e.excerpt)),
      tags: e.tags,
      format: 'mdx',
      body: e.code,
      feedHtml: e.feedHtml,
      source: e.raw,
    }
  })
  const old: Post[] = archive.map(e => {
    const slug = slugFromPath(e.path)
    return {
      slug,
      url: `/writing/${slug}`,
      title: e.title,
      dateRaw: e.date,
      date: calendarDate(e.date),
      kind: 'archive',
      draft: false,
      summary: clip(plain(e.excerpt)),
      tags: e.categories,
      format: 'html',
      body: e.html,
    }
  })
  const all = [...fresh, ...old]
  assertUniqueSlugs(all)
  return all
}

export const getPosts = (): Post[] => selectPosts(fromVelite())

export const getPost = (slug: string) => getPosts().find(p => p.slug === slug)

export function adjacentPosts(slug: string): { newer?: Post; older?: Post } {
  const list = getPosts()
  const i = list.findIndex(p => p.slug === slug)
  return i < 0 ? {} : { newer: list[i - 1], older: list[i + 1] }
}
