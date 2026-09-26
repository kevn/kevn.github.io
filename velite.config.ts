import { defineConfig, defineCollection, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'

// Dates stay raw strings: the calendar date as written is the WRITTEN stamp, and
// s.isodate() would normalize to UTC and can shift the day.
const isoDate = () => s.string().regex(/^\d{4}-\d{2}-\d{2}/)

const writing = defineCollection({
  name: 'WritingEntry',
  pattern: 'writing/*.mdx',
  schema: s.object({
    title: s.string().max(140),
    date: isoDate(),
    updated: isoDate().optional(),
    kind: s.enum(['essay', 'build-log', 'field-notes']),
    draft: s.boolean().default(false),
    summary: s.string().max(300).optional(),
    tags: s.array(s.string()).default([]),
    path: s.path(),
    excerpt: s.excerpt({ length: 200 }),
    code: s.mdx(),
    raw: s.raw(),
    // Static HTML of the same body for the RSS feed (JSX components render as plain markdown).
    feedHtml: s.markdown({ copyLinkedFiles: false }),
  }),
})

const archive = defineCollection({
  name: 'ArchiveEntry',
  pattern: 'archive/*.md',
  schema: s.object({
    title: s.string().max(140),
    date: isoDate(),
    categories: s.array(s.string()).default([]),
    path: s.path(),
    excerpt: s.excerpt({ length: 200 }),
    html: s.markdown({ copyLinkedFiles: false, removeComments: true }),
  }),
})

const pages = defineCollection({
  name: 'PageEntry',
  pattern: 'pages/*.mdx',
  schema: s.object({ title: s.string(), updated: isoDate(), path: s.path(), code: s.mdx(), raw: s.raw() }),
})

export default defineConfig({
  root: 'content',
  output: { data: '.velite', assets: 'public/static', base: '/static/', name: '[name]-[hash:6].[ext]', clean: true },
  collections: { writing, archive, pages },
  mdx: { rehypePlugins: [[rehypePrettyCode, { theme: 'tokyo-night', keepBackground: false }]] },
})
