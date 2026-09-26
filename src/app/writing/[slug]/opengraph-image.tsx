import { notFound } from 'next/navigation'
import { ogImage, OG_SIZE } from '@/lib/og'
import { getPost, getPosts, KIND_LABEL } from '@/lib/posts'
import { formatStamp } from '@/lib/dates'

export const size = OG_SIZE
export const contentType = 'image/png'
// Unknown or draft slugs 404 instead of throwing (500).
export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map(p => ({ slug: p.slug }))
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  if (!post) notFound()
  return ogImage({ kicker: KIND_LABEL[post.kind], title: post.title, stamp: formatStamp(post.date) })
}
