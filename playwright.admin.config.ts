import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/admin/e2e',
  outputDir: './test-results/admin',
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:5174',
    channel: process.env.PLAYWRIGHT_CHANNEL === 'chrome' ? 'chrome' : undefined,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm qa:admin',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
