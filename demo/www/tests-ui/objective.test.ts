import { test, expect } from '@playwright/test'

test.describe('Homepage UI', () => {
  test('should display the welcome content on the homepage', async ({
    page
  }) => {
    // Navigate to the homepage.
    await page.goto('/')
  })
})
