import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('home page loads with correct heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Shereef Elias' })).toBeVisible()
  })

  test('nav links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation')).toBeVisible()
    for (const label of ['Home', 'Work', 'Advisory', 'Infographics', 'System Design', 'About']) {
      await expect(page.getByRole('link', { name: label, exact: true })).toBeVisible()
    }
  })

  test('work page shows project cards', async ({ page }) => {
    await page.goto('/work')
    await expect(page.getByRole('heading', { name: 'Work' })).toBeVisible()
    await expect(page.getByRole('article').first()).toBeVisible()
  })

  test('advisory page shows client cards', async ({ page }) => {
    await page.goto('/advisory')
    await expect(page.getByRole('heading', { name: 'Advisory' })).toBeVisible()
    await expect(page.getByRole('article').first()).toBeVisible()
  })

  test('infographics page renders D3 chart', async ({ page }) => {
    await page.goto('/infographics')
    await expect(page.getByRole('heading', { name: 'Infographics' })).toBeVisible()
    await expect(page.getByLabel('Bar chart showing skill proficiency scores')).toBeVisible()
  })

  test('system design page loads', async ({ page }) => {
    await page.goto('/system-design')
    await expect(page.getByRole('heading', { name: 'System Design' })).toBeVisible()
    await expect(page.getByRole('article').first()).toBeVisible()
  })

  test('about page loads', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByRole('heading', { name: 'Shereef Elias' })).toBeVisible()
    await expect(page.getByRole('link', { name: /linkedin/i }).first()).toBeVisible()
  })
})
