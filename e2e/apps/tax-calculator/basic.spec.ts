import { test, expect } from '@playwright/test';

test.describe('Tax Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tax-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('消費税計算ツール')).toBeVisible();
  });

  test('should show amount input field', async ({ page }) => {
    await expect(page.locator('#amount')).toBeVisible();
  });

  test('should have tax rate selector defaulting to 10%', async ({ page }) => {
    await expect(page.getByText('10% (標準税率)')).toBeVisible();
  });

  test('should calculate tax-inclusive price from exclusive (10% rate)', async ({ page }) => {
    await page.locator('#amount').fill('1000');
    await page.getByRole('button', { name: /計算/ }).click();
    // 1000 * 1.1 = 1100
    await expect(page.getByText(/1,100|¥1,100/)).toBeVisible();
  });

  test('should calculate tax amount (10% of 1000 = 100)', async ({ page }) => {
    await page.locator('#amount').fill('1000');
    await page.getByRole('button', { name: /計算/ }).click();
    await expect(page.getByText(/¥100/)).toBeVisible();
  });

  test('should calculate with 8% reduced tax rate', async ({ page }) => {
    // Switch to 8% rate
    const taxRateSelect = page.getByRole('combobox').first();
    await taxRateSelect.click();
    await page.getByRole('option', { name: '8% (軽減税率)' }).click();
    await page.locator('#amount').fill('1000');
    await page.getByRole('button', { name: /計算/ }).click();
    // 1000 * 1.08 = 1080
    await expect(page.getByText(/1,080|¥1,080/)).toBeVisible();
  });

  test('should show exclusive, tax, and inclusive amounts', async ({ page }) => {
    await page.locator('#amount').fill('2000');
    await page.getByRole('button', { name: /計算/ }).click();
    await expect(page.getByText('税抜金額')).toBeVisible();
    await expect(page.getByText('消費税')).toBeVisible();
    await expect(page.getByText('税込金額')).toBeVisible();
  });

  test('should toggle calculation direction with arrow button', async ({ page }) => {
    // Default: exclusive → inclusive
    await expect(page.getByText('税抜金額 → 税込金額')).toBeVisible();
    await page.getByRole('button', { name: /toggle calculation direction/i }).click();
    // After toggle: inclusive → exclusive
    await expect(page.getByText('税込金額 → 税抜金額')).toBeVisible();
  });

  test('should calculate reverse (tax-inclusive to exclusive)', async ({ page }) => {
    // Toggle to inclusive mode
    await page.getByRole('button', { name: /toggle calculation direction/i }).click();
    // Enter tax-inclusive amount 1100
    await page.locator('#amount').fill('1100');
    await page.getByRole('button', { name: /計算/ }).click();
    // 1100 / 1.1 ≈ 1000 exclusive
    await expect(page.getByText(/1,000|¥1,000/)).toBeVisible();
  });

  test('should show batch calculation section', async ({ page }) => {
    await expect(page.getByText('一括計算')).toBeVisible();
  });

  test('should add item to batch calculation', async ({ page }) => {
    await page.locator('#batchAmount').fill('500');
    await page.getByRole('button', { name: /追加/ }).click();
    // Item appears in table
    await expect(page.getByText('品目 1')).toBeVisible();
  });

  test('should show total in batch calculation', async ({ page }) => {
    await page.locator('#batchAmount').fill('1000');
    await page.getByRole('button', { name: /追加/ }).click();
    await page.locator('#batchAmount').fill('500');
    await page.getByRole('button', { name: /追加/ }).click();
    // Total row should appear
    await expect(page.getByText('合計')).toBeVisible();
  });
});
