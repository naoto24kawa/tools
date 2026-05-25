import { test, expect } from '@playwright/test';

test.describe('Date Diff Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-diff');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Date Diff Calculator/i })).toBeVisible();
  });

  test('should show diff result on load with default dates', async ({ page }) => {
    // Default: today vs today+30 days
    await expect(page.getByText('合計日数')).toBeVisible();
  });

  test('should calculate 1 day difference', async ({ page }) => {
    const date1 = page.locator('#date1');
    const date2 = page.locator('#date2');
    await date1.fill('2024-01-01T00:00');
    await date2.fill('2024-01-02T00:00');
    // Expect "合計日数" to show 1 日
    await expect(page.getByText('合計日数')).toBeVisible();
    await expect(page.getByText(/1 日/)).toBeVisible();
  });

  test('should calculate 365 day difference for a full year', async ({ page }) => {
    const date1 = page.locator('#date1');
    const date2 = page.locator('#date2');
    await date1.fill('2024-01-01T00:00');
    await date2.fill('2025-01-01T00:00');
    // 2024 is a leap year: 366 days
    await expect(page.getByText('合計日数')).toBeVisible();
    await expect(page.getByText(/366 日/)).toBeVisible();
  });

  test('should show hours and minutes breakdown', async ({ page }) => {
    const date1 = page.locator('#date1');
    const date2 = page.locator('#date2');
    await date1.fill('2024-01-01T00:00');
    await date2.fill('2024-01-02T00:00');
    await expect(page.getByText('合計時間')).toBeVisible();
    await expect(page.getByText('合計分')).toBeVisible();
    await expect(page.getByText('合計秒')).toBeVisible();
  });

  test('should display year/month/day breakdown', async ({ page }) => {
    const date1 = page.locator('#date1');
    const date2 = page.locator('#date2');
    await date1.fill('2020-01-01T00:00');
    await date2.fill('2024-06-15T00:00');
    // Should show years/months/days in the large display
    await expect(page.getByText(/年/)).toBeVisible();
    await expect(page.getByText(/ヶ月/)).toBeVisible();
  });
});
