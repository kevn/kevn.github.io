import type { Metadata, Viewport } from 'next'
import { SAME_AS } from '@/lib/structured-data'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { fontVars } from '@/lib/fonts'
import { site } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Kevin Hunt · software, AI agents & flying machines', template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: 'Kevin Hunt', url: `${site.url}/about` }],
  creator: 'Kevin Hunt',
  publisher: 'Kevin Hunt',
  category: 'technology',
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = { themeColor: '#0c0b1c', colorScheme: 'dark' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body className="bg-ink font-body text-cream antialiased">
        {SAME_AS.map(href => (
          <link key={href} rel="me" href={href} />
        ))}
        <SiteNav />
        {children}
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
