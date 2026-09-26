import { site } from './site'
import type { Post } from './posts'
import { postBody } from './page-markdown'
import { SAME_AS } from './structured-data'
import { PROJECTS } from '@/data/projects'
import { WORKBENCH, shelf } from '@/data/workbench'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const published = (posts: Post[]) => posts.filter(p => !p.draft)
const rfc822 = (p: Post) => new Date(Date.UTC(p.date.y, p.date.m - 1, p.date.d, 12)).toUTCString()
const abs = (p: Post) => `${site.url}${p.url}`

/** RSS 2.0 with full content. Archive posts are HTML already; MDX posts need `renderMdx`. */
export function buildRssFeed(posts: Post[], renderMdx?: (p: Post) => string): string {
  const html = (p: Post) => (p.format === 'html' ? p.body : renderMdx?.(p))
  const items = published(posts)
    .map(
      p =>
        `<item><title>${esc(p.title)}</title><link>${abs(p)}</link><guid isPermaLink="true">${abs(p)}</guid><pubDate>${rfc822(p)}</pubDate><description>${esc(p.summary)}</description>${
          html(p) ? `<content:encoded>${cdata(html(p)!)}</content:encoded>` : ''
        }</item>`,
    )
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>${site.name}</title><link>${site.url}</link><description>${esc(site.description)}</description><language>en</language>${items}</channel></rss>`
}

const INTRO =
  "Kevin Hunt is co-founder and CTO of Deep Fathom, an AI-native cybersecurity platform for high-stakes environments. On the side he makes small, useful apps at Rival Bear. He writes here about building with AI agents, leading engineering teams, and the things he flies and builds. Every page has a Markdown version: append .md to its URL, or request it with Accept: text/markdown."

const header = () => [`# Kevin Hunt · ${site.name}`, '', `> ${site.description}`, '', INTRO, '']

/** llms.txt (llmstxt.org layout): a map of the site for language models, linking to Markdown twins. */
export function buildLlmsTxt(posts: Post[]): string {
  return [
    ...header(),
    '## About',
    `- [About Kevin Hunt](${site.url}/about.md): Bio and a then/now timeline.`,
    `- [What I'm building](${site.url}/progress.md): Deep Fathom, Rival Bear and the personal projects on the workbench.`,
    '',
    '## Writing',
    ...published(posts).map(p => `- [${p.title}](${abs(p)}.md): ${p.dateRaw.slice(0, 10)}. ${p.summary}`),
    '',
    '## Projects',
    ...PROJECTS.map(p => `- [${p.name}](${p.href}): ${p.role}. ${p.blurb}`),
    ...shelf(WORKBENCH).map(w => `- ${w.href ? `[${w.name}](${w.href.startsWith('http') ? w.href : site.url + w.href})` : w.name}: ${w.hook} Started ${w.started}; ${w.status.toLowerCase()}.`),
    '',
    '## Elsewhere',
    ...SAME_AS.map(u => `- ${u}`),
    `- Email: ${site.email}`,
    '',
    '## Optional',
    `- [Full text of every post](${site.url}/llms-full.txt)`,
    `- [RSS feed](${site.url}/feed.xml)`,
    `- [Sitemap](${site.url}/sitemap.xml)`,
    '',
  ].join('\n')
}

/** llms-full.txt: every published post in full, as Markdown. */
export function buildLlmsFull(posts: Post[]): string {
  const body = published(posts)
    .map(p => [`### ${p.title}`, `URL: ${abs(p)}`, `Date: ${p.dateRaw.slice(0, 10)}`, 'Author: Kevin Hunt', p.tags.length ? `Tags: ${p.tags.join(', ')}` : '', '', `_${p.summary}_`, '', postBody(p), ''].filter((l, i) => l !== '' || i > 4).join('\n'))
    .join('\n---\n\n')
  return [...header(), '## Writing', '', body].join('\n')
}
