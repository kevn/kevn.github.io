import { Crt } from './crt'

/** Header band for inner pages: soft CRT, kicker label, big display title. Runs up behind the nav. */
export function PageHero({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="relative -mt-24 overflow-hidden border-b border-cream/10 bg-[radial-gradient(ellipse_at_80%_0%,#1d1a4a_0%,#0c0b1c_60%)] pt-24">
      <Crt intensity="soft" />
      <div className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-12 md:px-16 md:pt-16">
        <p className="font-label text-xs tracking-[.24em] text-cyan">{kicker}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{title}</h1>
        {children}
      </div>
    </section>
  )
}
