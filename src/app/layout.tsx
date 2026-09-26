import type { Metadata } from 'next'
import { fontVars } from '@/lib/fonts'
import { site } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Kevin Hunt`, template: `%s · ${site.name}` },
  description: site.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body className="bg-ink font-body text-cream antialiased">{children}</body>
    </html>
  )
}
