import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests', fullyParallel: true, workers: 3,
  use: { baseURL: 'http://127.0.0.1:4174', channel: process.env.PLAYWRIGHT_CHANNEL || undefined, trace: 'retain-on-failure' },
  webServer: { command: 'node tests/server.mjs', url: 'http://127.0.0.1:4174', reuseExistingServer: !process.env.CI },
})
