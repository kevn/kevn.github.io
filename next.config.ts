import type { NextConfig } from 'next'
import { readdirSync } from 'node:fs'
import { legacyRedirects, STATIC_REDIRECTS } from './src/lib/redirects'

const nextConfig: NextConfig = {
  async redirects() {
    return [...legacyRedirects(readdirSync('content/archive')), ...STATIC_REDIRECTS]
  },
}

export default nextConfig
