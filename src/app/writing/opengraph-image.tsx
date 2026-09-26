import { ogImage, OG_SIZE } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = "Essays, build logs and field notes, then and now."

export default function OG() {
  return ogImage({ kicker: 'KEV.IN/WRITING', title: "Essays, build logs and field notes, then and now." })
}
