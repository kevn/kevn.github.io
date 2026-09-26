import { ogImage, OG_SIZE } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = "Kevin Hunt — CTO of Deep Fathom, shipping software since dialup."

export default function OG() {
  return ogImage({ kicker: 'KEV.IN/ABOUT', title: "Kevin Hunt — CTO of Deep Fathom, shipping software since dialup." })
}
