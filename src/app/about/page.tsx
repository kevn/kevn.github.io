import type { Metadata } from 'next'
import Link from 'next/link'
import { pages } from '#site/content'
import { PageHero } from '@/components/page-hero'
import { MDXContent } from '@/components/mdx-content'
import { Readout } from '@/components/readout'
import { TIMELINE, yearText } from '@/data/timeline'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({ title: 'About', description: 'Kevin Hunt: CTO of Deep Fathom, maker of small, useful apps at Rival Bear, shipping software since dialup.', path: '/about' })

export default function About() {
  const about = pages.find(p => p.path.endsWith('about'))
  if (!about) throw new Error('content/pages/about.mdx is missing')
  return (
    <main>
      <PageHero kicker="KEV.IN/ABOUT" title="About" />
      <div className="mx-auto grid max-w-[1200px] gap-16 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="prose-k">
          <MDXContent code={about.code} />
        </div>
        <section aria-labelledby="then-now">
          <h2 id="then-now" className="font-display text-2xl">
            Then <span className="font-script text-3xl text-atomic">&amp;</span> now
          </h2>
          <ol className="mt-6 flex flex-col gap-5 border-l border-cream/15 pl-5">
            {TIMELINE.map((t, i) => (
              <li key={i} className="relative">
                <span aria-hidden="true" className="absolute -left-[26px] top-2 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_10px_#3ff0ff]" />
                <Readout label="YEAR" text={yearText(t.year)} tone={t.year === 2026 ? 'green' : 'magenta'} ghostFor="8888" />
                <span className="sr-only">{t.year ?? 'Year to be confirmed'}: </span>
                <p className="mt-2 text-lg leading-snug text-[#e6e1f2]">
                  {t.href ? (
                    t.href.startsWith('http') ? (
                      <a href={t.href} className="underline decoration-cyan decoration-2 underline-offset-4 hover:text-magenta">{t.what}</a>
                    ) : (
                      <Link href={t.href} className="underline decoration-cyan decoration-2 underline-offset-4 hover:text-magenta">{t.what}</Link>
                    )
                  ) : (
                    t.what
                  )}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
