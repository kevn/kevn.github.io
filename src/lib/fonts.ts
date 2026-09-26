import { Michroma, Instrument_Sans, Space_Mono, Yellowtail } from 'next/font/google'
import localFont from 'next/font/local'

// next/font variables use an --nf- prefix; globals.css maps them into Tailwind's
// --font-* theme names (a same-named var would reference itself).
export const display = Michroma({ weight: '400', subsets: ['latin'], variable: '--nf-display', display: 'swap' })
export const body = Instrument_Sans({ subsets: ['latin'], variable: '--nf-body', display: 'swap' })
export const label = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--nf-label', display: 'swap' })
export const script = Yellowtail({ weight: '400', subsets: ['latin'], variable: '--nf-script', display: 'swap' })
export const seg = localFont({ src: '../../public/fonts/DSEG14Classic-Regular.woff2', variable: '--nf-seg', display: 'swap' })

export const fontVars = [display, body, label, script, seg].map(f => f.variable).join(' ')
