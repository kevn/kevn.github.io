import Link from 'next/link'
import { Wordmark } from './wordmark'
import { site } from '@/lib/site'

const LINKS = [
  ['Writing', '/writing', '#3ff0ff'],
  ['Progress', '/progress', '#ff4fd8'],
  ['Sights', '/sights', '#8bff6b'],
  ['About', '/about', ''],
] as const

export function SiteNav() {
  return (
    <header className="relative z-50 mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-5 px-5 pt-6 md:px-16 md:pt-8">
      <Link href="/" aria-label="kev.in home">
        <Wordmark size={24} label="kev.in" />
      </Link>
      <nav aria-label="Primary" className="order-last flex w-full flex-wrap justify-between gap-x-6 font-label text-xs tracking-[.14em] text-[#cfc9e6] md:order-none md:w-auto md:items-center md:text-sm">
        {LINKS.map(([name, href, star]) => (
          <span key={href} className="flex items-center gap-6">
            <Link href={href} className="uppercase transition-colors hover:text-cyan">
              {name}
            </Link>
            {star && (
              <span aria-hidden="true" className="hidden md:inline" style={{ color: star }}>
                ✦
              </span>
            )}
          </span>
        ))}
      </nav>
      <a href={`mailto:${site.email}`} className="rounded-full bg-cream px-4 py-2.5 font-label text-sm font-bold text-ink transition-transform hover:scale-105">
        {site.email}
      </a>
    </header>
  )
}
