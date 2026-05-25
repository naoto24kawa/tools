import { test, expect } from '@playwright/test';

test.describe('HTTP Status Codes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-http-status');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /HTTP Status Codes/i })).toBeVisible();
  });

  test('should list status codes on initial load', async ({ page }) => {
    // Multiple status code entries should be visible
    await expect(page.getByText('200')).toBeVisible();
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('500')).toBeVisible();
  });

  test('should filter by keyword search', async ({ page }) => {
    const searchInput = page.getByLabel('検索');
    await searchInput.fill('Not Found');
    await expect(page.getByText('404')).toBeVisible();
    // 200 OK should not appear when filtering for "Not Found"
    await expect(page.getByText('200')).toBeHidden();
  });

  test('should filter by status code number', async ({ page }) => {
    await page.getByLabel('検索').fill('404');
    await expect(page.getByText('Not Found')).toBeVisible();
    await expect(page.getByText('200')).toBeHidden();
  });

  test('should filter by 2xx Success category', async ({ page }) => {
    const group = page.getByRole('group', { name: /Filter by category/i });
    await group.getByRole('button', { name: /2xx/i }).click();
    await expect(page.getByText('200')).toBeVisible();
    await expect(page.getByText('404')).toBeHidden();
  });

  test('should filter by 4xx Client Error category', async ({ page }) => {
    const group = page.getByRole('group', { name: /Filter by category/i });
    await group.getByRole('button', { name: /4xx/i }).click();
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('200')).toBeHidden();
  });

  test('should filter by 5xx Server Error category', async ({ page }) => {
    const group = page.getByRole('group', { name: /Filter by category/i });
    await group.getByRole('button', { name: /5xx/i }).click();
    await expect(page.getByText('500')).toBeVisible();
    await expect(page.getByText('200')).toBeHidden();
  });

  test('should show all codes when All is clicked after filtering', async ({ page }) => {
    const group = page.getByRole('group', { name: /Filter by category/i });
    await group.getByRole('button', { name: /4xx/i }).click();
    await group.getByRole('button', { name: /All/i }).click();
    await expect(page.getByText('200')).toBeVisible();
    await expect(page.getByText('404')).toBeVisible();
  });

  test('should show no results message for unknown search term', async ({ page }) => {
    await page.getByLabel('検索').fill('zzz-no-match-zzz');
    await expect(page.getByText('該当なし')).toBeVisible();
  });
});
