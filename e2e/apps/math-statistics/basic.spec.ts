import { test, expect } from '@playwright/test';

test.describe('Math Statistics Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/math-statistics');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Statistics Calculator/i);
    await expect(page.getByRole('heading', { name: /Statistics Calculator/i })).toBeVisible();
  });

  test('should show data input textarea', async ({ page }) => {
    await expect(page.getByLabel('数値データ入力')).toBeVisible();
    await expect(page.getByText(/カンマ\/スペース\/改行/)).toBeVisible();
  });

  test('should show count of detected numbers', async ({ page }) => {
    const textarea = page.getByLabel('数値データ入力');
    await textarea.fill('1, 2, 3, 4, 5');
    await expect(page.getByText(/5 個の数値を検出/)).toBeVisible();
  });

  test('should calculate statistics for [1,2,3,4,5]', async ({ page }) => {
    const textarea = page.getByLabel('数値データ入力');
    await textarea.fill('1, 2, 3, 4, 5');
    // Results card should appear
    await expect(page.getByText('Results', { exact: true })).toBeVisible();
    // Count = 5
    await expect(page.getByText('個数').locator('..').getByText('5')).toBeVisible();
    // Sum = 15
    await expect(page.getByText('合計').locator('..').getByText('15.0000')).toBeVisible();
    // Mean = 3
    await expect(page.getByText('平均').locator('..').getByText('3.0000')).toBeVisible();
    // Median = 3
    await expect(page.getByText('中央値').locator('..').getByText('3.0000')).toBeVisible();
  });

  test('should display min and max values', async ({ page }) => {
    const textarea = page.getByLabel('数値データ入力');
    await textarea.fill('10, 20, 30, 40, 50');
    await expect(page.getByText('最小値').locator('..').getByText('10')).toBeVisible();
    await expect(page.getByText('最大値').locator('..').getByText('50')).toBeVisible();
  });

  test('should accept space-separated numbers', async ({ page }) => {
    const textarea = page.getByLabel('数値データ入力');
    await textarea.fill('2 4 6 8');
    await expect(page.getByText(/4 個の数値を検出/)).toBeVisible();
    await expect(page.getByText('合計').locator('..').getByText('20.0000')).toBeVisible();
  });
});
