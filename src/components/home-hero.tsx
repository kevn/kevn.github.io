import Link from 'next/link'
import { Wordmark } from './wordmark'
import { Sparkle, Starburst } from './ornaments'
import { AtomicClock } from './atomic-clock'
import { HERO_BIO } from '@/data/bio'

export function HomeHero() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-5 pt-10 md:px-16 md:pt-20">
      <Sparkle size={34} color="#3ff0ff" className="absolute left-[6%] top-[4%]" />
      <Sparkle size={22} color="#8bff6b" className="absolute left-[40%] top-0" delay={0.7} />
      <Sparkle size={40} color="#ff4fd8" className="absolute right-[6%] top-[78%]" delay={1.1} />
      <Starburst size={70} color="#ff6b35" className="absolute left-[58%] top-[4%] hidden md:block" delay={0.5} />
      <Starburst size={54} color="#3ff0ff" className="absolute -bottom-6 left-[2%]" delay={1.3} />
      <AtomicClock size={300} className="absolute right-[5%] top-2 hidden lg:block" />
      <AtomicClock size={120} layout="row" className="mb-6 w-fit lg:hidden" />
      <p className="rise origin-left -rotate-6 font-script text-5xl text-atomic [text-shadow:0_0_22px_rgb(255_107_53/.6)] md:text-7xl">Greetings from</p>
      <h1 className="rise mt-3 [animation-delay:.1s]">
        <Wordmark size={210} label="kev.in" className="h-auto w-full max-w-[830px]" />
      </h1>
      <p id="hero-bio" className="rise mt-7 max-w-[720px] text-xl leading-relaxed text-[#d9d3ec] [animation-delay:.25s] md:text-2xl">
        {HERO_BIO}
      </p>
      <div className="rise mt-9 flex flex-wrap gap-3.5 [animation-delay:.4s]">
        <Link href="/writing" className="rounded-full bg-cyan px-8 py-4 text-lg font-semibold text-ink shadow-[0_0_30px_rgb(63_240_255/.45)] transition-transform hover:scale-105">
          Read the dispatches →
        </Link>
        <Link href="/progress" className="rounded-full border-[1.5px] border-cream px-8 py-4 text-lg font-semibold transition-transform hover:scale-105">
          What I&apos;m building
        </Link>
      </div>
    </section>
  )
}
