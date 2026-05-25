import { test, expect } from '@playwright/test';

test.describe('Text Emoji Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-emoji-search');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Emoji Search' })).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search emoji/i);
    await expect(searchInput).toBeVisible();
  });

  test('should show category buttons including All and Recent', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: /recent/i })).toBeVisible();
  });

  test('should display emojis in All category by default', async ({ page }) => {
    await expect(page.getByText('All Emojis')).toBeVisible();
    await expect(page.getByText(/emojis found/i)).toBeVisible();
  });

  test('should filter emojis when searching by keyword', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search emoji/i);
    await searchInput.fill('smile');
    await expect(page.getByText(/results for "smile"/i)).toBeVisible();
  });

  test('should show no results message for unknown query', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search emoji/i);
    await searchInput.fill('xyzabc123notanemoji');
    await expect(page.getByText(/no emojis found/i)).toBeVisible();
  });

  test('should switch to Recent tab when Recent button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /recent/i }).click();
    await expect(page.getByText('Recently Used')).toBeVisible();
  });

  test('should show empty state in Recent when no emojis have been used', async ({ page }) => {
    await page.getByRole('button', { name: /recent/i }).click();
    await expect(page.getByText(/no recently used emojis yet/i)).toBeVisible();
  });

  test('should show emoji count', async ({ page }) => {
    const countText = page.getByText(/\d+ emojis found/i);
    await expect(countText).toBeVisible();
    const text = await countText.textContent();
    const count = parseInt(text?.match(/(\d+)/)?.[1] ?? '0', 10);
    expect(count).toBeGreaterThan(0);
  });
});
