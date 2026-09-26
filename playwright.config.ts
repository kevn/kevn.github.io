import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3100' },
  webServer: { command: 'pnpm build && pnpm start -p 3100', url: 'http://localhost:3100', timeout: 240_000, reuseExistingServer: !process.env.CI },
})
