import { ogImage, OG_SIZE } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = "Photographs by Kevin Hunt."

export default function OG() {
  return ogImage({ kicker: 'KEV.IN/SIGHTS', title: "Photographs by Kevin Hunt." })
}
