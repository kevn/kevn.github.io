import { ogImage, OG_SIZE } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = "What I'm building: Deep Fathom, Rival Bear and the workbench."

export default function OG() {
  return ogImage({ kicker: 'KEV.IN/PROGRESS', title: "What I'm building: Deep Fathom, Rival Bear and the workbench." })
}
