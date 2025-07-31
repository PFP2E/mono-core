import { defineConfig, devices } from '@playwright/test'
import path from 'path'

// The base URL to use in Playwright tests.
// This is set in the compose.yml file for the test service.
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 30 * 1000, // Reduced global test timeout to 30 seconds
  testDir: path.join(__dirname, 'tests-ui'),
  retries: 1,
  reporter: 'line',

  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },

  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Maximum time each action such as `click()` can take. Defaults to 0 (no limit).
    actionTimeout: 5000,

    // Do not collect a trace.
    trace: 'off',

    ignoreHTTPSErrors: true
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    // Add other browsers/devices if needed
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    }
  ]
})
