import { test, expect } from '@playwright/test'

test.describe('Login Tests', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  test('Logt succesvol in met geldige gegevens', async ({ page }) => {
    await page.fill('input#email', 'brent@example.com')
    await page.fill('input#password', 'Azerty123!')

    await page.click('button[type="submit"]')
    await page.waitForResponse('https://localhost:32770/login')

    await expect(page.locator('text=Login succesvol')).toBeVisible()
    await expect(page).toHaveURL(/.*\/connect/)
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  test('Weigert login met ongeldige gegevens', async ({ page }) => {
    await page.fill('input#email', 'ongeldigemail.com')
    await page.fill('input#password', '123')

    await page.click('button[type="submit"]')

    const emailError = page.locator('span.field-error', {
      hasText: 'Email is in een niet geldig formaat',
    })
    await expect(emailError).toBeVisible()
  })
})
