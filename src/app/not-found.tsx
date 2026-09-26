import type { Metadata } from 'next'
import Link from 'next/link'
import { MoonRocket } from '@/components/moon-rocket'

export const metadata: Metadata = { title: 'Off course', robots: { index: false } }

export default function NotFound() {
  return (
    <main className="relative mx-auto max-w-[1440px] px-5 pb-10 md:px-16">
      <MoonRocket />
      <h1 className="-mt-6 font-display text-4xl md:-mt-16 md:text-6xl">This page flew off course.</h1>
      <p className="mt-4 text-xl text-muted">
        It&apos;s lodged somewhere in the moon. Try the{' '}
        <Link className="text-cyan underline underline-offset-4" href="/writing">
          writing
        </Link>{' '}
        or head{' '}
        <Link className="text-cyan underline underline-offset-4" href="/">
          home
        </Link>
        .
      </p>
    </main>
  )
}
