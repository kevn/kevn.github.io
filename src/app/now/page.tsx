import type { Metadata } from 'next'
import { pages } from '#site/content'
import { PageHero } from '@/components/page-hero'
import { MDXContent } from '@/components/mdx-content'
import { Readout } from '@/components/readout'
import { calendarDate, formatLong, formatStamp } from '@/lib/dates'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({ title: 'Now', description: 'What Kevin Hunt is up to right now.', path: '/now' })

export default function Now() {
  const now = pages.find(p => p.path.endsWith('now'))
  if (!now) throw new Error('content/pages/now.mdx is missing')
  const updated = calendarDate(now.updated)
  return (
    <main>
      <PageHero kicker="KEV.IN/NOW" title="Now">
        <div className="mt-6">
          <Readout label="UPDATED" text={formatStamp(updated)} tone="cyan" />
          <span className="sr-only">Updated {formatLong(updated)}.</span>
        </div>
      </PageHero>
      <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-10">
        <div className="prose-k">
          <MDXContent code={now.code} />
        </div>
      </div>
    </main>
  )
}
