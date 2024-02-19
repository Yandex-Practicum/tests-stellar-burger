import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  retries: 3,
  workers: 1,
  testDir: './__tests__',
  outputDir: './tmp/artifacts',
  use: {
    baseURL: 'http://127.0.0.1:4000',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    locale: 'ru-RU',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.js/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use prepared auth state.
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  // webServer: {
  //   command: 'cd ./blog-customizer && npm run start',
  //   url: 'http://127.0.0.1:4000',
  // },
});
