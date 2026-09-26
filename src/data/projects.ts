import type { Post, PostKind } from '@/lib/posts'

export interface Project {
  slug: string
  name: string
  role: string
  blurb: string
  href: string
  /** Link to this kind of writing once any exists; until then fall back to `href`. */
  kind?: PostKind
  accent: '#3ff0ff' | '#ff4fd8' | '#8bff6b' | '#7b6cff'
  children?: { name: string; href: string; blurb: string }[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'deep-fathom',
    name: 'Deep Fathom',
    role: 'Co-founder & CTO',
    accent: '#3ff0ff',
    href: 'https://www.deepfathom.ai',
    blurb: 'An AI-native compliance platform for the U.S. Defense Industrial Base.',
  },
  {
    slug: 'rival-bear',
    name: 'Rival Bear',
    role: 'Founder',
    accent: '#ff4fd8',
    href: 'https://rivalbear.com',
    blurb: 'My indie studio in the Sierra Nevada.',
    children: [
      { name: 'Yonder', href: 'https://www.getyonder.app', blurb: 'A GPS tour guide that narrates the road.' },
      { name: 'Twiggybank', href: 'https://www.twiggybank.com', blurb: 'A family bank that grows like a garden.' },
      { name: 'Balance Point', href: 'https://rivalbear.com/balancepoint', blurb: 'The long view of your weight. In development.' },
    ],
  },
  {
    slug: 'fpv',
    name: 'FPV & flight',
    role: 'Pilot & builder',
    accent: '#8bff6b',
    href: '/now',
    kind: 'field-notes',
    blurb: 'Quads, sims, and an 18 kg octocopter.',
  },
  {
    slug: 'terrain',
    name: 'Maps & terrain',
    role: 'Tinkerer',
    accent: '#7b6cff',
    href: '/now',
    kind: 'build-log',
    blurb: 'OpenStreetMap to 3D, GIS and Unreal scenes.',
  },
]

export function projectHref(project: Project, posts: Post[]): string {
  return project.kind && posts.some(p => p.kind === project.kind) ? `/writing?kind=${project.kind}` : project.href
}
