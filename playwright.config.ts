import { defineConfig, devices } from '@playwright/test';

const MOCK_API_PORT = Number(process.env.MOCK_PORT ?? 4000);
const WEB_PORT = Number(process.env.E2E_PORT ?? 3000);
const WEB_URL = `http://localhost:${WEB_PORT}`;
const MOCK_API_URL = `http://localhost:${MOCK_API_PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: WEB_URL,
    channel: process.env.PLAYWRIGHT_CHANNEL === 'chrome' ? 'chrome' : undefined,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
  webServer: [
    {
      command: 'pnpm e2e:mock',
      url: MOCK_API_URL,
      reuseExistingServer: false,
      // CI에선 디버그 위해 pipe, 로컬에선 노이즈 줄이려 ignore
      stdout: process.env.CI ? 'pipe' : 'ignore',
      stderr: 'pipe',
    },
    {
      command: `pnpm --filter web exec next dev --port ${WEB_PORT}`,
      url: WEB_URL,
      reuseExistingServer: !process.env.CI && process.env.E2E_REUSE_SERVER === 'true',
      env: {
        NEXT_PUBLIC_API_BASE_URL: MOCK_API_URL,
        NEXT_PUBLIC_DIAGNOSIS_FEEDBACK_MODE: 'api',
        NEXT_PUBLIC_ANALYSIS_DEMO_MODE: 'false',
        NEXT_PUBLIC_GTM_ID: '',
        PORT: String(WEB_PORT),
        E2E_DIST_DIR: process.env.E2E_DIST_DIR ?? '.next-e2e',
      },
      stdout: process.env.CI ? 'pipe' : 'ignore',
      stderr: 'pipe',
      timeout: 240 * 1000,
    },
  ],
});
