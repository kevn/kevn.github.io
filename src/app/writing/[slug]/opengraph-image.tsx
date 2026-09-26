import { ogImage, OG_SIZE } from '@/lib/og'
import { getPost, getPosts, KIND_LABEL } from '@/lib/posts'
import { formatStamp } from '@/lib/dates'

export const size = OG_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return getPosts().map(p => ({ slug: p.slug }))
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)!
  return ogImage({ kicker: KIND_LABEL[post.kind], title: post.title, stamp: formatStamp(post.date) })
}
