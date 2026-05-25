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
    // Use a known Monday to Friday range (2024-01-08 to 2024-01-12 = 5 working days)
    await page.getByLabel('開始日').first().fill('2024-01-08');
    await page.getByLabel('終了日').fill('2024-01-12');
    await page.getByRole('button', { name: /計算/i }).first().click();

    // Result section should appear with working days count
    await expect(page.getByText('営業日')).toBeVisible();
    await expect(page.getByText('5日')).toBeVisible({ timeout: 3000 });
  });

  test('should calculate end date from working days', async ({ page }) => {
    await page.getByLabel('開始日').nth(1).fill('2024-01-08');
    await page.getByLabel('営業日数').fill('5');
    await page.getByRole('button', { name: /計算/i }).nth(1).click();

    // Should display the resulting end date
    await expect(page.getByText('2024-01-12')).toBeVisible({ timeout: 3000 });
  });

  test('should show custom holidays card', async ({ page }) => {
    await expect(page.getByText('カスタム休日')).toBeVisible();
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
    await expect(page.getByText(/日付を入力/i)).toBeVisible({ timeout: 3000 });
  });
});
