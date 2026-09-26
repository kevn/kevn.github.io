import type { Metadata } from 'next'
import { readdirSync } from 'node:fs'
import Image from 'next/image'
import { PageHero } from '@/components/page-hero'
import { pageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import { sightsGraph } from '@/lib/page-graphs'

export const metadata: Metadata = pageMetadata({ title: 'Sights', description: 'Photographs by Kevin Hunt.', path: '/sights' })

// Drop images into public/sights/ to populate the grid.
function photos(): string[] {
  try {
    return readdirSync('public/sights').filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort()
  } catch {
    return []
  }
}

export default function Sights() {
  const list = photos()
  return (
    <main>
      <JsonLd graph={sightsGraph()} />
      <PageHero kicker="KEV.IN/SIGHTS" title="Sights" />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-16">
        {list.length > 0 && (
          <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(f => (
              <li key={f}>
                <Image src={`/sights/${f}`} alt="" width={900} height={600} className="h-auto w-full rounded-2xl object-cover" />
              </li>
            ))}
          </ul>
        )}
        <a href="https://kevinhunt.com" className="block max-w-xl rounded-[48px_14px_48px_14px] border border-green/50 p-8 transition-colors hover:border-green">
          <span className="font-label text-xs tracking-[.2em] text-green">THE FULL COLLECTION</span>
          <span className="mt-3 block font-display text-2xl">kevinhunt.com →</span>
          <span className="mt-2 block text-muted">My photography lives there.</span>
        </a>
      </div>
    </main>
  )
}
