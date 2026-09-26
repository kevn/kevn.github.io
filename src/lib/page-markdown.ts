import { pages } from '#site/content'
import { HERO_BIO } from '@/data/bio'
import { PROJECTS } from '@/data/projects'
import { TIMELINE, yearText } from '@/data/timeline'
import { WORKBENCH, shelf } from '@/data/workbench'
import { formatLong } from './dates'
import { frontmatter, htmlToMarkdown } from './markdown'
import { getPost, getPosts, KIND_LABEL, type Post } from './posts'
import { SAME_AS } from './structured-data'
import { site } from './site'

// Markdown twins of every page: what AI crawlers and agents read instead of
// the HTML. Served at /<path>.md and to clients that send Accept: text/markdown.

const abs = (path: string) => `${site.url}${path}`
const head = (title: string, description: string, path: string, extra: Record<string, unknown> = {}) =>
  frontmatter({ title, description, author: 'Kevin Hunt', ...extra, canonical: abs(path || '/') })

const postLine = (p: Post) => `- [${p.title}](${abs(p.url)}): ${formatLong(p.date)}. ${p.summary}`

export function postBody(p: Post): string {
  return p.format === 'mdx' ? (p.source ?? '').trim() : htmlToMarkdown(p.body)
}

function post(p: Post): string {
  const date = p.dateRaw.slice(0, 10)
  const fm = head(p.title, p.summary, p.url, {
    date,
    updated: p.updated ? `${p.updated.y}-${String(p.updated.m).padStart(2, '0')}-${String(p.updated.d).padStart(2, '0')}` : undefined,
    kind: KIND_LABEL[p.kind].toLowerCase(),
    tags: p.tags.length ? p.tags : undefined,
  })
  const note = p.kind === 'archive' ? `\n_From the archive: written in ${p.date.y}._\n` : ''
  return `${fm}\n# ${p.title}\n${note}\n${postBody(p)}\n`
}

const workbenchLines = () =>
  shelf(WORKBENCH).map(w => {
    const link = w.href ? ` ${w.href.startsWith('http') ? w.href : abs(w.href)}` : ''
    return `- **${w.name}**: ${w.hook} Started ${w.started}. Status: ${w.status.toLowerCase()}.${link}`
  })

const PAGES: Record<string, () => string> = {
  '': () =>
    `${head('Kevin Hunt · kev.in', site.description, '/')}\n# Kevin Hunt\n\n${HERO_BIO}\n\n## Latest writing\n\n${getPosts().slice(0, 5).map(postLine).join('\n')}\n\n## What I'm building\n\n${PROJECTS.map(p => `- [${p.name}](${p.href}) (${p.role}): ${p.blurb}`).join('\n')}\n\n## On the workbench\n\n${workbenchLines().join('\n')}\n\n## Elsewhere\n\n${SAME_AS.map(u => `- ${u}`).join('\n')}\n- Email: ${site.email}\n`,
  about: () => {
    const about = pages.find(p => p.path.endsWith('about'))
    return `${head('About Kevin Hunt', 'Kevin Hunt: CTO of Deep Fathom, maker of small, useful apps at Rival Bear, shipping software since dialup.', '/about', { updated: about?.updated })}\n# About Kevin Hunt\n\n${about?.raw.trim() ?? ''}\n\n## Then & now\n\n${TIMELINE.map(t => `- ${yearText(t.year)}: ${t.what}`).join('\n')}\n`
  },
  writing: () => {
    const posts = getPosts()
    const years = [...new Set(posts.map(p => p.date.y))]
    return `${head('Writing', 'Essays, build logs and field notes by Kevin Hunt, then and now.', '/writing')}\n# Writing\n\n${years.map(y => `## ${y}\n\n${posts.filter(p => p.date.y === y).map(postLine).join('\n')}`).join('\n\n')}\n`
  },
  progress: () =>
    `${head("What I'm building", 'What Kevin Hunt is building: Deep Fathom, Rival Bear, and the personal projects on the workbench.', '/progress')}\n# What I'm building\n\n${PROJECTS.map(p => `- [${p.name}](${p.href}) (${p.role}): ${p.blurb}`).join('\n')}\n\n## On the workbench\n\nPersonal projects, then and now.\n\n${workbenchLines().join('\n')}\n`,
  sights: () => `${head('Sights', 'Photographs by Kevin Hunt.', '/sights')}\n# Sights\n\nMy photography lives at https://kevinhunt.com.\n`,
}

export function markdownPaths(): string[] {
  return [...Object.keys(PAGES), ...getPosts().map(p => p.url.slice(1))]
}

export function markdownFor(path: string): string | null {
  if (path in PAGES) return PAGES[path]()
  const m = /^writing\/([^/]+)$/.exec(path)
  const p = m ? getPost(m[1]) : undefined
  return p ? post(p) : null
}
