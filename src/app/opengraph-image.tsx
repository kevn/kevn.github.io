import { ogImage, OG_SIZE } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'kev.in — Kevin Hunt'

export default function OG() {
  return ogImage({ kicker: 'GREETINGS FROM', title: 'Software, agents, leadership and flying machines.' })
}
