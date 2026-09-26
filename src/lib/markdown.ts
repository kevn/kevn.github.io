import TurndownService from 'turndown'

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', emDelimiter: '_' })
turndown.remove(['script', 'style', 'iframe'])

/** Archive HTML → clean Markdown (entities decoded, code fenced). */
export const htmlToMarkdown = (html: string) => turndown.turndown(html).trim()

const yaml = (v: unknown): string => (Array.isArray(v) ? `[${v.map(yaml).join(', ')}]` : JSON.stringify(String(v)))

/** YAML frontmatter block; undefined values are omitted. */
export function frontmatter(fields: Record<string, unknown>): string {
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${yaml(v)}`)
  return `---\n${lines.join('\n')}\n---\n`
}
