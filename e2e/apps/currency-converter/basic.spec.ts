import { test, expect } from '@playwright/test';

test.describe('Currency Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/currency-converter');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /通貨換算ツール/i })).toBeVisible();
  });

  test('should show amount input field', async ({ page }) => {
    await expect(page.locator('input#amount')).toBeVisible();
  });

  test('should show source and destination currency selectors', async ({ page }) => {
    // Two comboboxes for currency selection
    const combos = page.getByRole('combobox');
    const count = await combos.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should show conversion result when amount is entered', async ({ page }) => {
    await page.locator('input#amount').fill('1000');
    // Result area should show something other than ---
    await expect(page.getByText('---')).not.toBeVisible();
  });

  test('should show rate information after entering amount', async ({ page }) => {
    await page.locator('input#amount').fill('1000');
    // Exchange rate info (1 JPY = X USD format)
    await expect(page.getByText(/1 JPY/i)).toBeVisible();
  });

  test('should swap currencies when swap button is clicked', async ({ page }) => {
    // Initial state: JPY -> USD
    await page.locator('input#amount').fill('100');
    const swapButton = page.getByRole('button', { name: /swap currencies/i });
    await swapButton.click();
    // After swap: USD -> JPY (order changes)
    const combos = page.getByRole('combobox');
    const firstValue = await combos.first().textContent();
    expect(firstValue).toContain('USD');
  });

  test('should show rate editor when 編集 button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /編集/i }).click();
    // Rate editor grid should appear
    await expect(page.getByText(/USD|EUR|GBP/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /デフォルトに戻す/i })).toBeVisible();
  });

  test('should show Copy button after entering amount', async ({ page }) => {
    await page.locator('input#amount').fill('1000');
    await expect(page.getByRole('button', { name: /コピー/i })).toBeVisible();
  });

  test('should not show result for empty amount', async ({ page }) => {
    // With no amount, result should show ---
    await expect(page.getByText('---')).toBeVisible();
  });
});
