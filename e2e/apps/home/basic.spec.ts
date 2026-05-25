import { test, expect } from '@playwright/test';

test.describe('Home (Tool Directory)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load page with Elchika Tools heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /elchika tools/i })).toBeVisible();
  });

  test('should display tool count badge', async ({ page }) => {
    // Badge shows the total number of apps as a number in a rounded pill
    const badge = page.locator('span.rounded-full').first();
    await expect(badge).toBeVisible();
    const text = await badge.textContent();
    expect(Number(text?.trim())).toBeGreaterThan(0);
  });

  test('should show search input', async ({ page }) => {
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('should filter tools by search query', async ({ page }) => {
    await page.getByRole('textbox').fill('json');
    // At least one tool card matching "json" should be visible
    await expect(page.getByText(/json/i).first()).toBeVisible();
  });

  test('should show no tools message when search yields no results', async ({ page }) => {
    await page.getByRole('textbox').fill('xyznonexistenttool12345');
    await expect(page.getByText(/no tools found/i)).toBeVisible();
  });

  test('should clear search filter via Clear filters link', async ({ page }) => {
    await page.getByRole('textbox').fill('xyznonexistenttool12345');
    await expect(page.getByText(/no tools found/i)).toBeVisible();
    await page.getByRole('button', { name: /clear filters/i }).click();
    await expect(page.getByText(/no tools found/i)).not.toBeVisible();
  });

  test('should display category filter buttons', async ({ page }) => {
    // Category filter buttons are rendered; at least one should exist
    const filterButtons = page.locator('header button');
    await expect(filterButtons.first()).toBeVisible();
  });

  test('should display tool cards in a grid', async ({ page }) => {
    // Tool cards are anchor links or elements inside the main grid
    const cards = page.locator('main a');
    const count = await cards.count();
    expect(count).toBeGreaterThan(10);
  });

  test('should show footer with privacy note', async ({ page }) => {
    await expect(page.locator('footer')).toContainText(/all processing happens in your browser/i);
  });
});
