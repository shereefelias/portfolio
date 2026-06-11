import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('home page loads with correct heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Shereef Elias' })).toBeVisible()
    await expect(page.getByRole('link', { name: /linkedin/i })).toBeVisible()
  })

  test('nav links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation')).toBeVisible()
    for (const label of ['Work', 'Viz', 'System Design', 'Contact']) {
      await expect(page.getByRole('link', { name: label })).toBeVisible()
    }
  })

  test('work page shows project cards', async ({ page }) => {
    await page.goto('/work')
    await expect(page.getByRole('heading', { name: 'Work' })).toBeVisible()
    await expect(page.getByRole('article').first()).toBeVisible()
  })

  test('viz page renders D3 chart', async ({ page }) => {
    await page.goto('/viz')
    await expect(page.getByRole('heading', { name: 'Visualizations' })).toBeVisible()
    await expect(page.getByLabel('Bar chart showing skill proficiency scores')).toBeVisible()
  })

  test('system design page loads', async ({ page }) => {
    await page.goto('/system-design')
    await expect(page.getByRole('heading', { name: 'System Design' })).toBeVisible()
  })

  test('contact form renders all fields', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Message')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible()
  })
})
