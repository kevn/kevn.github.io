import { Starburst } from './ornaments'
import type { Project } from '@/data/projects'

/** Project card with a slanted, glowing "roof" bar and a starburst badge. */
export function ProjectCard({ project, href = project.href }: { project: Project; href?: string }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className="relative block rounded-[18px_18px_60px_18px] border border-cream/10 bg-ink-2 px-7 pb-7 pt-11 transition-transform duration-300 hover:-translate-y-1.5"
    >
      <span aria-hidden="true" className="absolute -top-4 left-[-10px] right-[40%] h-7 -skew-x-[28deg] rounded-md" style={{ background: project.accent, boxShadow: `0 0 22px ${project.accent}` }} />
      <Starburst size={56} color={project.accent} className="absolute -top-8 right-4" />
      <p className="font-label text-[11px] tracking-[.18em]" style={{ color: project.accent }}>
        {project.role.toUpperCase()}
      </p>
      <h3 className="mt-2 font-display text-xl text-cream md:text-2xl">{project.name}</h3>
      <p className="mt-3 text-[17px] leading-relaxed text-muted">{project.blurb}</p>
    </a>
  )
}
