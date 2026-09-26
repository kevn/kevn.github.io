export interface Project {
  slug: string
  name: string
  role: string
  blurb: string
  href: string
  accent: '#3ff0ff' | '#ff4fd8' | '#8bff6b' | '#7b6cff'
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
    role: 'Side studio',
    accent: '#ff4fd8',
    href: 'https://rivalbear.com',
    blurb: 'Small, useful apps: Yonder, Twiggybank, Balance Point.',
  },
]

