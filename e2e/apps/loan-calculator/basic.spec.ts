import { test, expect } from '@playwright/test';

test.describe('Loan Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loan-calculator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/ローン|Loan/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ローン返済シミュレーター/ })).toBeVisible();
  });

  test('should calculate monthly payment for equal-payment method', async ({ page }) => {
    await page.locator('#principal').fill('10000000');
    await page.locator('#rate').fill('3');
    await page.locator('#years').fill('35');

    await page.getByRole('button', { name: /シミュレーション実行/ }).click();

    await expect(page.getByText('結果サマリー')).toBeVisible();
    await expect(page.getByText('毎月の返済額')).toBeVisible();
    await expect(page.getByText('返済総額')).toBeVisible();
    await expect(page.getByText('利息総額')).toBeVisible();
  });

  test('should display repayment schedule table', async ({ page }) => {
    await page.locator('#principal').fill('1000000');
    await page.locator('#rate').fill('2');
    await page.locator('#years').fill('5');

    await page.getByRole('button', { name: /シミュレーション実行/ }).click();

    await expect(page.getByText('返済スケジュール', { exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '回' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '返済額' })).toBeVisible();
  });

  test('should calculate for equal-principal method', async ({ page }) => {
    await page.locator('#principal').fill('5000000');
    await page.locator('#rate').fill('2.5');
    await page.locator('#years').fill('20');

    // Switch to 元金均等返済
    await page.getByText('元利均等返済').click();
    await page.getByRole('option', { name: '元金均等返済' }).click();

    await page.getByRole('button', { name: /シミュレーション実行/ }).click();

    await expect(page.getByText('初月の返済額')).toBeVisible();
  });

  test('should show error for missing principal', async ({ page }) => {
    await page.locator('#rate').fill('3');
    await page.locator('#years').fill('10');

    await page.getByRole('button', { name: /シミュレーション実行/ }).click();

    await expect(page.getByText('借入額を正の数で入力してください', { exact: true })).toBeVisible();
  });

  test('should show error for missing repayment period', async ({ page }) => {
    await page.locator('#principal').fill('1000000');
    await page.locator('#rate').fill('3');

    await page.getByRole('button', { name: /シミュレーション実行/ }).click();

    await expect(page.getByText('返済期間を入力してください', { exact: true })).toBeVisible();
  });

  test('should handle months field for partial year', async ({ page }) => {
    await page.locator('#principal').fill('500000');
    await page.locator('#rate').fill('1');
    await page.locator('#years').fill('2');
    await page.locator('#months').fill('6');

    await page.getByRole('button', { name: /シミュレーション実行/ }).click();

    await expect(page.getByText('結果サマリー')).toBeVisible();
    // 2 years 6 months = 30 months
    await expect(page.getByText(/30回/)).toBeVisible();
  });

  test('should show canvas chart after calculation', async ({ page }) => {
    await page.locator('#principal').fill('3000000');
    await page.locator('#rate').fill('2');
    await page.locator('#years').fill('10');

    await page.getByRole('button', { name: /シミュレーション実行/ }).click();

    await expect(page.getByText('元金 vs 利息 (年別)')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
  });
});
