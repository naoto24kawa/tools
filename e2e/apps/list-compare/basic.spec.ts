import { test, expect } from '@playwright/test';

test.describe('List Compare', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/list-compare');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/List Compare/i)).toBeVisible();
  });

  test('should show common items between two lists', async ({ page }) => {
    await page.locator('textarea#list-a').fill('apple\nbanana\ncherry');
    await page.locator('textarea#list-b').fill('banana\ncherry\ndate');
    // Default view is "共通" (common)
    await expect(page.getByText('banana')).toBeVisible();
    await expect(page.getByText('cherry')).toBeVisible();
  });

  test('should show items only in list A', async ({ page }) => {
    await page.locator('textarea#list-a').fill('apple\nbanana\ncherry');
    await page.locator('textarea#list-b').fill('banana\ncherry\ndate');
    await page.getByRole('button', { name: /Aのみ/i }).click();
    await expect(page.getByText('apple')).toBeVisible();
    // "banana" and "cherry" should NOT appear in the result area
  });

  test('should show items only in list B', async ({ page }) => {
    await page.locator('textarea#list-a').fill('apple\nbanana');
    await page.locator('textarea#list-b').fill('banana\ndate\nfig');
    await page.getByRole('button', { name: /Bのみ/i }).click();
    await expect(page.getByText('date')).toBeVisible();
    await expect(page.getByText('fig')).toBeVisible();
  });

  test('should show union of both lists', async ({ page }) => {
    await page.locator('textarea#list-a').fill('apple\nbanana');
    await page.locator('textarea#list-b').fill('cherry\ndate');
    await page.getByRole('button', { name: /和集合/i }).click();
    await expect(page.getByText('apple')).toBeVisible();
    await expect(page.getByText('cherry')).toBeVisible();
  });

  test('should show item count in view mode buttons', async ({ page }) => {
    await page.locator('textarea#list-a').fill('apple\nbanana\ncherry');
    await page.locator('textarea#list-b').fill('banana\ncherry\ndate');
    // Common button should show count (2)
    await expect(page.getByRole('button', { name: /共通 \(2\)/i })).toBeVisible();
  });

  test('should be case-sensitive by default', async ({ page }) => {
    await page.locator('textarea#list-a').fill('Apple\nbanana');
    await page.locator('textarea#list-b').fill('apple\nbanana');
    // "Apple" != "apple" → common should only have "banana"
    await expect(page.getByRole('button', { name: /共通 \(1\)/i })).toBeVisible();
  });

  test('should ignore case when case-sensitive is unchecked', async ({ page }) => {
    await page.locator('textarea#list-a').fill('Apple\nbanana');
    await page.locator('textarea#list-b').fill('apple\nbanana');
    await page.locator('input#caseSensitive').uncheck();
    // Now "Apple" == "apple" → common should have 2
    await expect(page.getByRole('button', { name: /共通 \(2\)/i })).toBeVisible();
  });

  test('should show "結果なし" when no common items exist', async ({ page }) => {
    await page.locator('textarea#list-a').fill('apple');
    await page.locator('textarea#list-b').fill('banana');
    // Default view is common, which has 0 items
    await expect(page.getByText('結果なし')).toBeVisible();
  });
});
