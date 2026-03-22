import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  timeout: 120_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'off',
    trace: 'off',
  },
  projects: [
    {
      name: 'iPhone 14',
      use: {
        ...devices['iPhone 14'],
        browserName: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173',
    port: 4173,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
