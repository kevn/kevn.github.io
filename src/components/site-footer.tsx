import { Wordmark } from './wordmark'
import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="relative mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-12 pt-24 md:flex-row md:items-end md:justify-between md:px-16">
      <div className="min-w-0">
        <p className="origin-left -rotate-[5deg] font-script text-4xl text-atomic md:text-5xl">See you in the future</p>
        <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} className="mt-3 block">
          <Wordmark text="hi@kev.in" size={72} label="hi@kev.in" className="h-auto max-w-full" />
        </a>
      </div>
      <p className="font-label text-xs leading-7 tracking-[.16em] text-[#9d97b8] md:text-right">
        BAY AREA, CA
        <br />
        ON THE AIR SINCE 2005
      </p>
    </footer>
  )
}
