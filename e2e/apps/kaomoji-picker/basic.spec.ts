import { test, expect } from '@playwright/test';

test.describe('Kaomoji Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kaomoji-picker');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Kaomoji/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Kaomoji Picker' })).toBeVisible();
  });

  test('should display kaomojis by default (All category)', async ({ page }) => {
    await expect(page.getByText('All Kaomojis')).toBeVisible();
    // At least one kaomoji button should be visible
    await expect(page.locator('button[title]').first()).toBeVisible();
  });

  test('should show kaomoji count', async ({ page }) => {
    await expect(page.getByText(/kaomojis found/)).toBeVisible();
  });

  test('should search kaomojis by keyword', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by keyword (happy, cat, music...)');
    await searchInput.fill('happy');

    await expect(page.getByText(/Results for "happy"/)).toBeVisible();
    // At least one result
    const buttons = page.locator('button[title]');
    await expect(buttons.first()).toBeVisible();
  });

  test('should show no results for unknown keyword', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by keyword (happy, cat, music...)');
    await searchInput.fill('xyzunknownterm12345');

    await expect(page.getByText('No kaomojis found.')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    // Click on a category button other than All
    const happyBtn = page.getByRole('button', { name: /Happy|happy/i }).first();
    await happyBtn.click();

    // Should show filtered results
    await expect(page.locator('button[title]').first()).toBeVisible();
  });

  test('should switch to Recent tab and show empty state initially', async ({ page }) => {
    await page.getByRole('button', { name: /Recent/i }).click();
    await expect(page.getByText('No recently used kaomojis yet.')).toBeVisible();
  });

  test('should return to All category when All button clicked', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by keyword (happy, cat, music...)');
    await searchInput.fill('happy');

    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.getByText('All Kaomojis')).toBeVisible();
  });
});
