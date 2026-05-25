import { test, expect } from '@playwright/test';

test.describe('Compound Interest Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/compound-interest');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/複利計算/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '複利計算シミュレーター' })).toBeVisible();
  });

  test('should show input fields', async ({ page }) => {
    await expect(page.getByLabel('元本 (円)')).toBeVisible();
    await expect(page.getByLabel('年利 (%)')).toBeVisible();
    await expect(page.getByLabel('運用期間 (年)')).toBeVisible();
    await expect(page.getByLabel('毎月積立額 (円)')).toBeVisible();
  });

  test('should show calculate button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /計算する/i })).toBeVisible();
  });

  test('should calculate compound interest for 1,000,000 yen at 5% for 10 years', async ({ page }) => {
    await page.getByLabel('元本 (円)').fill('1000000');
    await page.getByLabel('年利 (%)').fill('5');
    await page.getByLabel('運用期間 (年)').fill('10');
    await page.getByRole('button', { name: /計算する/i }).click();

    // Should show results section
    await expect(page.getByText('結果')).toBeVisible();
    await expect(page.getByText('最終金額')).toBeVisible();
    // 1,000,000 * (1 + 0.05/12)^120 ≈ 1,647,009 (monthly compounding)
    await expect(page.getByText(/1,6[0-9][0-9],[0-9]+/)).toBeVisible();
  });

  test('should show total contributions and interest earned', async ({ page }) => {
    await page.getByLabel('元本 (円)').fill('1000000');
    await page.getByLabel('年利 (%)').fill('5');
    await page.getByLabel('運用期間 (年)').fill('10');
    await page.getByRole('button', { name: /計算する/i }).click();

    await expect(page.getByText('元本+積立合計')).toBeVisible();
    await expect(page.getByText('運用益')).toBeVisible();
  });

  test('should show yearly breakdown table', async ({ page }) => {
    await page.getByLabel('元本 (円)').fill('1000000');
    await page.getByLabel('年利 (%)').fill('5');
    await page.getByLabel('運用期間 (年)').fill('5');
    await page.getByRole('button', { name: /計算する/i }).click();

    await expect(page.getByText('年別推移')).toBeVisible();
    const table = page.locator('table');
    await expect(table).toBeVisible();
    // 5 years of rows
    await expect(page.getByText('5年目')).toBeVisible();
  });

  test('should show growth chart canvas after calculation', async ({ page }) => {
    await page.getByLabel('元本 (円)').fill('1000000');
    await page.getByLabel('年利 (%)').fill('5');
    await page.getByLabel('運用期間 (年)').fill('10');
    await page.getByRole('button', { name: /計算する/i }).click();

    await expect(page.getByText('成長グラフ')).toBeVisible();
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should calculate with monthly contributions', async ({ page }) => {
    await page.getByLabel('元本 (円)').fill('0');
    await page.getByLabel('年利 (%)').fill('5');
    await page.getByLabel('運用期間 (年)').fill('10');
    await page.getByLabel('毎月積立額 (円)').fill('10000');
    await page.getByRole('button', { name: /計算する/i }).click();

    await expect(page.getByText('結果')).toBeVisible();
    // 10,000/month for 10 years at 5% ~ 1,555,000+
    await expect(page.getByText('最終金額')).toBeVisible();
  });

  test('should show error when no period is entered', async ({ page }) => {
    await page.getByLabel('元本 (円)').fill('1000000');
    await page.getByLabel('年利 (%)').fill('5');
    await page.getByRole('button', { name: /計算する/i }).click();
    await expect(page.getByText(/運用期間を入力/i)).toBeVisible();
  });

  test('should switch compounding frequency', async ({ page }) => {
    await page.getByText('複利頻度').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: '毎年' }).click();

    await page.getByLabel('元本 (円)').fill('1000000');
    await page.getByLabel('年利 (%)').fill('5');
    await page.getByLabel('運用期間 (年)').fill('10');
    await page.getByRole('button', { name: /計算する/i }).click();

    // 1,000,000 * (1.05)^10 ≈ 1,628,894
    await expect(page.getByText(/1,628/)).toBeVisible();
  });

  test('should show entry section heading', async ({ page }) => {
    await expect(page.getByText('入力')).toBeVisible();
  });
});
