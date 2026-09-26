import Link from 'next/link'
import { KIND_LABEL, type Post } from '@/lib/posts'
import { TimeStamp } from './timestamp'

/** Post card: asymmetric Googie radius, coloured top rule, title and then/now readouts. */
export function GoogieCard({ post, accent }: { post: Post; accent: string }) {
  return (
    <Link
      href={post.url}
      className="group flex flex-col justify-between gap-6 rounded-[48px_12px_48px_12px] border border-cream/12 bg-cream/[.04] p-7 transition-transform duration-300 [transition-timing-function:cubic-bezier(.3,1.5,.4,1)] hover:-translate-y-1.5 md:flex-row md:items-center md:rounded-[64px_14px_64px_14px] md:px-11 md:py-8"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="min-w-0 max-w-[720px]">
        <p className="font-label text-xs tracking-[.2em]" style={{ color: accent }}>
          {KIND_LABEL[post.kind]}
          {post.tags[0] ? ` · ${post.tags[0].toUpperCase()}` : ''}
        </p>
        <h3 className="mt-3 font-display text-xl leading-snug text-cream transition-colors group-hover:text-cyan md:text-3xl">{post.title}</h3>
      </div>
      <TimeStamp written={post.date} updated={post.updated} draft={post.draft} />
    </Link>
  )
}
