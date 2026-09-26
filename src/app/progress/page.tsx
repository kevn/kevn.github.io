import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { WorkbenchCard } from '@/components/workbench-card'
import { PROJECTS } from '@/data/projects'
import { WORKBENCH, shelf } from '@/data/workbench'
import { pageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import { progressGraph } from '@/lib/page-graphs'

export const metadata: Metadata = pageMetadata({
  title: 'Progress',
  description: 'What Kevin Hunt is building: Deep Fathom, Rival Bear, and the personal projects on the workbench — then and now.',
  path: '/progress',
})

export default function Side() {
  return (
    <main>
      <JsonLd graph={progressGraph()} />
      <PageHero kicker="KEV.IN/PROGRESS" title="What I'm building" />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-16">
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-5">
          {PROJECTS.map(p => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <h2 className="mt-24 font-display text-3xl">On the workbench</h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">Personal projects, then and now: what&apos;s in flight, what&apos;s on the bench, and what&apos;s been mothballed.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shelf(WORKBENCH).map(item => (
            <WorkbenchCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </main>
  )
}
