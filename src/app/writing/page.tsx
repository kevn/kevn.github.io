import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { GoogieCard } from '@/components/googie-card'
import { getPosts, KIND_LABEL, type PostKind } from '@/lib/posts'
import { pageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import { writingGraph } from '@/lib/page-graphs'

export const metadata: Metadata = pageMetadata({ title: 'Writing', description: 'Essays, build logs and field notes by Kevin Hunt, then and now.', path: '/writing' })

const ACCENTS = ['#ff4fd8', '#3ff0ff', '#8bff6b', '#7b6cff']
const KINDS = Object.keys(KIND_LABEL) as PostKind[]

function Filter({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={`rounded-full border px-4 py-2 transition-colors ${active ? 'border-cyan text-cyan' : 'border-cream/20 hover:border-cream/50'}`}>
      {label}
    </Link>
  )
}

export default async function WritingIndex({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams
  const active = KINDS.includes(kind as PostKind) ? (kind as PostKind) : undefined
  const posts = getPosts().filter(p => !active || p.kind === active)
  const years = [...new Set(posts.map(p => p.date.y))]
  return (
    <main>
      <JsonLd graph={writingGraph(getPosts())} />
      <PageHero kicker="DISPATCHES · THEN & NOW" title="Writing">
        <nav aria-label="Filter by kind" className="mt-8 flex flex-wrap gap-2 font-label text-xs tracking-[.14em]">
          <Filter href="/writing" label="ALL" active={!active} />
          {KINDS.map(k => (
            <Filter key={k} href={`/writing?kind=${k}`} label={KIND_LABEL[k]} active={active === k} />
          ))}
        </nav>
      </PageHero>
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-16">
        {posts.length === 0 && <p className="text-lg text-muted">Nothing here yet. Check back soon.</p>}
        {years.map(y => (
          <section key={y} aria-labelledby={`y${y}`} className="mb-16">
            <h2 id={`y${y}`} className="font-display text-5xl text-cream/90 md:text-7xl">
              {y}
            </h2>
            <div className="mt-6 flex flex-col gap-4">
              {posts
                .filter(p => p.date.y === y)
                .map((p, i) => (
                  <GoogieCard key={p.slug} post={p} accent={ACCENTS[i % 4]} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
