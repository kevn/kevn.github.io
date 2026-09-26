import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { PROJECTS } from '@/data/projects'

export const metadata: Metadata = {
  title: 'Side',
  description: 'What Kevin Hunt is building: Deep Fathom, Rival Bear, and the experiments in between.',
  alternates: { canonical: '/side' },
}

export default function Side() {
  const studio = PROJECTS.find(p => p.slug === 'rival-bear')?.children ?? []
  return (
    <main>
      <PageHero kicker="KEV.IN/SIDE" title="What I'm building" />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-16">
        <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {PROJECTS.map(p => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <h2 className="mt-24 font-display text-3xl">From the Rival Bear studio</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {studio.map(c => (
            <li key={c.name}>
              <a href={c.href} target="_blank" rel="noopener" className="block h-full rounded-[40px_12px_40px_12px] border border-magenta/40 p-7 transition-colors hover:border-magenta">
                <span className="font-display text-xl">{c.name}</span>
                <span className="mt-2 block text-muted">{c.blurb}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
