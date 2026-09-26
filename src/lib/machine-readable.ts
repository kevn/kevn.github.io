import { site } from './site'
import type { Post } from './posts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const published = (posts: Post[]) => posts.filter(p => !p.draft)
const rfc822 = (p: Post) => new Date(Date.UTC(p.date.y, p.date.m - 1, p.date.d, 12)).toUTCString()
const abs = (p: Post) => `${site.url}${p.url}`

/** RSS 2.0. Archive (HTML) posts carry full content; MDX posts carry their summary. */
export function buildRssFeed(posts: Post[]): string {
  const items = published(posts)
    .map(
      p =>
        `<item><title>${esc(p.title)}</title><link>${abs(p)}</link><guid isPermaLink="true">${abs(p)}</guid><pubDate>${rfc822(p)}</pubDate><description>${esc(p.summary)}</description>${
          p.format === 'html' ? `<content:encoded>${cdata(p.body)}</content:encoded>` : ''
        }</item>`,
    )
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>${site.name}</title><link>${site.url}</link><description>${esc(site.description)}</description><language>en</language>${items}</channel></rss>`
}

export function buildLlmsTxt(posts: Post[]): string {
  return [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Writing',
    ...published(posts).map(p => `- [${p.title}](${abs(p)}): ${p.summary}`),
    '',
    '## Elsewhere',
    '- [Deep Fathom](https://www.deepfathom.ai)',
    '- [Rival Bear](https://rivalbear.com)',
    '- [Photography](https://kevinhunt.com)',
    '',
  ].join('\n')
}

export function buildLlmsFull(posts: Post[]): string {
  return published(posts)
    .map(p => `# ${p.title}\n${abs(p)}\n${p.dateRaw.slice(0, 10)}\n\n${p.format === 'html' ? p.body.replace(/<[^>]+>/g, '') : p.summary}\n`)
    .join('\n---\n\n')
}
