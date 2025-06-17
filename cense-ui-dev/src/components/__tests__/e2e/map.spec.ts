import { test, expect } from '@playwright/test'

test.describe('Map Search Tests', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input#email', 'brent@example.com')
    await page.fill('input#password', 'Azerty123!')
    await page.click('button[type="submit"]')
    await page.waitForURL(/.*\/connect/)
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  test('Zoekt gebruiker met de naam "Milan" op de map', async ({ page }) => {
    await page.goto('/map')

    await page.fill('input#search', 'Milan')
    await page.click('input#search + button[type="submit"]')

    await page.waitForResponse(
      'https://localhost:32770/api/v1/users?Term=Milan',
    )

    const userList = page.locator('li .user')
    await expect(userList).toHaveCount(1)

    const firstUser = await userList.first().textContent()
    expect(firstUser?.includes('Milan')).toBeTruthy()
  })
})
