import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Crt } from '@/components/crt'
import { MDXContent } from '@/components/mdx-content'
import { TimeStamp } from '@/components/timestamp'
import { adjacentPosts, getPost, getPosts, KIND_LABEL } from '@/lib/posts'
import { pageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import { postGraph } from '@/lib/page-graphs'

export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug)
  if (!post) return {}
  return {
    ...pageMetadata({ title: post.title, description: post.summary, path: post.url, article: { publishedTime: post.dateRaw.slice(0, 10), modifiedTime: post.updated ? `${post.updated.y}-${String(post.updated.m).padStart(2, '0')}-${String(post.updated.d).padStart(2, '0')}` : undefined, tags: post.tags } }),
    robots: post.draft ? { index: false } : undefined,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const { newer, older } = adjacentPosts(slug)
  return (
    <main>
      <JsonLd graph={postGraph(post)} />
      <header className="relative -mt-24 overflow-hidden border-b border-cream/10 bg-[radial-gradient(ellipse_at_80%_0%,#1d1a4a_0%,#0c0b1c_60%)] pt-24">
        <Crt intensity="soft" />
        <div className="relative mx-auto flex max-w-[1100px] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-10 md:py-16">
          <div className="min-w-0">
            <p className="font-label text-xs tracking-[.22em] text-magenta">
              {KIND_LABEL[post.kind]}
              {post.tags.length ? ` · ${post.tags.join(' · ').toUpperCase()}` : ''}
            </p>
            <h1 className="mt-4 max-w-[760px] font-display text-3xl leading-tight md:text-5xl">{post.title}</h1>
          </div>
          <TimeStamp written={post.date} updated={post.updated} draft={post.draft} />
        </div>
      </header>
      <article className="mx-auto max-w-[1100px] px-5 py-14 md:px-10">
        {post.kind === 'archive' && (
          <p className="mb-10 max-w-[68ch] rounded-2xl border border-amber/40 bg-amber/5 px-5 py-4 font-label text-sm leading-relaxed text-amber">
            From the archive. Written in {post.date.y}, when this site ran on Rails. Links may have drifted.
          </p>
        )}
        <div className="prose-k">
          {post.format === 'mdx' ? (
            <MDXContent code={post.body} />
          ) : (
            // Safe: Velite-rendered HTML from the 20 repo-controlled archive files; no user input reaches it.
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          )}
        </div>
      </article>
      <nav aria-label="More writing" className="mx-auto grid max-w-[1100px] gap-4 px-5 md:grid-cols-2 md:px-10">
        {older ? (
          <Link href={older.url} className="rounded-2xl border border-cream/10 p-6 transition-colors hover:border-cyan">
            <span className="font-label text-xs text-muted">← OLDER</span>
            <span className="mt-2 block font-display text-lg">{older.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={newer.url} className="rounded-2xl border border-cream/10 p-6 text-right transition-colors hover:border-cyan">
            <span className="font-label text-xs text-muted">NEWER →</span>
            <span className="mt-2 block font-display text-lg">{newer.title}</span>
          </Link>
        )}
      </nav>
    </main>
  )
}
