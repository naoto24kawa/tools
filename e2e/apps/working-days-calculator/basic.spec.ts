import { test, expect } from '@playwright/test';

test.describe('Working Days Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/working-days-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('営業日計算ツール')).toBeVisible();
  });

  test('should show period calculation card', async ({ page }) => {
    await expect(page.getByText('期間から営業日数を計算')).toBeVisible();
    await expect(page.getByLabel('開始日').first()).toBeVisible();
    await expect(page.getByLabel('終了日')).toBeVisible();
  });

  test('should show reverse calculation card', async ({ page }) => {
    await expect(page.getByText('営業日数から終了日を計算')).toBeVisible();
    await expect(page.getByLabel('営業日数')).toBeVisible();
  });

  test('should calculate working days between two dates', async ({ page }) => {
    // 2024-01-15 (Mon) to 2024-01-19 (Fri) = 5 working days (no Japanese holidays in range)
    await page.getByLabel('開始日').first().fill('2024-01-15');
    await page.getByLabel('終了日').fill('2024-01-19');
    await page.getByRole('button', { name: /計算/i }).first().click();

    // Result section should appear with working days count
    // Use the muted foreground label text specifically for the 営業日 label
    await expect(page.getByText('営業日', { exact: true })).toBeVisible({ timeout: 3000 });
    // Working days = 5日, shown in blue bold text
    await expect(page.locator('p.text-2xl.font-bold.text-blue-600')).toContainText('5日');
  });

  test('should calculate end date from working days', async ({ page }) => {
    // addWorkingDays counts from the day AFTER start date (exclusive-start)
    // From 2024-01-15 (Mon), +5 working days = 01-16(1), 01-17(2), 01-18(3), 01-19(4), 01-22(5) = 2024-01-22
    await page.getByLabel('開始日').nth(1).fill('2024-01-15');
    await page.getByLabel('営業日数').fill('5');
    await page.getByRole('button', { name: /計算/i }).nth(1).click();

    // Should display the resulting end date
    await expect(page.getByText('2024-01-22')).toBeVisible({ timeout: 3000 });
  });

  test('should show custom holidays card', async ({ page }) => {
    // "カスタム休日" is a shadcn CardTitle (renders as div.text-2xl, not a heading element)
    await expect(page.locator('div.text-2xl', { hasText: 'カスタム休日' })).toBeVisible();
    await expect(page.getByRole('button', { name: /追加/i })).toBeVisible();
  });

  test('should add and display custom holidays', async ({ page }) => {
    await page.getByLabel('休日を追加').fill('2024-12-26');
    await page.getByRole('button', { name: /追加/i }).click();
    await expect(page.getByText('2024-12-26')).toBeVisible();
  });

  test('should show error toast when calculate button clicked without dates', async ({ page }) => {
    // Clear dates and try to calculate
    await page.getByLabel('開始日').first().fill('');
    await page.getByLabel('終了日').fill('');
    await page.getByRole('button', { name: /計算/i }).first().click();
    // Toast title is exact text; avoid strict mode by using exact match
    await expect(page.getByText('日付を入力してください', { exact: true })).toBeVisible({ timeout: 3000 });
  });
});
