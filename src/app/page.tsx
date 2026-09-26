import { HomeHero } from '@/components/home-hero'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { Stripes } from '@/components/stripes'
import { GoogieCard } from '@/components/googie-card'
import { ProjectCard } from '@/components/project-card'
import { Crt } from '@/components/crt'
import { getPosts, homeDispatches } from '@/lib/posts'
import { PROJECTS, projectHref } from '@/data/projects'

export const metadata = pageMetadata({ description: site.description, path: '/' })

const ACCENTS = ['#ff4fd8', '#3ff0ff', '#8bff6b']

export default function Home() {
  const posts = getPosts()
  const dispatches = homeDispatches(posts)
  return (
    <main className="relative -mt-24 overflow-hidden bg-[radial-gradient(ellipse_at_70%_0%,#1d1a4a_0%,#0c0b1c_55%)] pt-24">
      <Crt intensity="full" />
      <HomeHero />
      <Stripes variant="hero-bend" className="mt-14 hidden md:block" />
      <Stripes variant="straight" className="mt-12 md:hidden" />
      <section aria-labelledby="dispatches" className="relative mx-auto mt-10 max-w-[1440px] px-5 md:-mt-6 md:px-16">
        <h2 id="dispatches" className="flex flex-wrap items-baseline gap-x-4 font-display text-4xl md:text-5xl">
          Dispatches <span className="font-script text-5xl text-atomic">then &amp; now</span>
        </h2>
        <div className="mt-8 flex flex-col gap-4">
          {dispatches.map((p, i) => (
            <GoogieCard key={p.slug} post={p} accent={ACCENTS[i % 3]} />
          ))}
        </div>
      </section>
      <section aria-labelledby="building" className="relative mx-auto mt-24 max-w-[1440px] px-5 md:px-16">
        <h2 id="building" className="font-display text-3xl md:text-4xl">
          What I&apos;m building
        </h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {PROJECTS.map(p => (
            <ProjectCard key={p.slug} project={p} href={projectHref(p, posts)} />
          ))}
        </div>
      </section>
    </main>
  )
}
