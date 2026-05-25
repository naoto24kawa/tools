import { test, expect } from '@playwright/test';

test.describe('Discount Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/discount-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('割引計算ツール')).toBeVisible();
  });

  test('should show calculate button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /計算/i })).toBeVisible();
  });

  test('should calculate percentage discount', async ({ page }) => {
    await page.locator('#price').fill('1000');
    await page.locator('#pctOff').fill('20');
    await page.getByRole('button', { name: /計算/i }).click();
    // 20% off 1000 = 800
    await expect(page.getByText(/¥800/)).toBeVisible();
  });

  test('should show savings amount after percentage discount', async ({ page }) => {
    await page.locator('#price').fill('1000');
    await page.locator('#pctOff').fill('20');
    await page.getByRole('button', { name: /計算/i }).click();
    // Savings should be 200
    await expect(page.getByText(/¥200/)).toBeVisible();
  });

  test('should calculate amount discount', async ({ page }) => {
    // Switch to amount mode
    await page.locator('[role="combobox"]').first().click();
    await page.getByRole('option', { name: '金額割引 (円)' }).click();

    await page.locator('#price').fill('1000');
    await page.locator('#amtOff').fill('300');
    await page.getByRole('button', { name: /計算/i }).click();
    // 1000 - 300 = 700
    await expect(page.getByText(/¥700/)).toBeVisible();
  });

  test('should show original price in result', async ({ page }) => {
    await page.locator('#price').fill('1000');
    await page.locator('#pctOff').fill('10');
    await page.getByRole('button', { name: /計算/i }).click();
    await expect(page.getByText('元の価格')).toBeVisible();
    await expect(page.getByText(/¥1,000/)).toBeVisible();
  });

  test('should show error for negative price', async ({ page }) => {
    await page.locator('#price').fill('-100');
    await page.locator('#pctOff').fill('10');
    await page.getByRole('button', { name: /計算/i }).click();
    await expect(page.getByText(/正の金額を入力してください/i)).toBeVisible();
  });

  test('should show Add to compare button after calculation', async ({ page }) => {
    await page.locator('#price').fill('1000');
    await page.locator('#pctOff').fill('20');
    await page.getByRole('button', { name: /計算/i }).click();
    await expect(page.getByRole('button', { name: /比較リストに追加/i })).toBeVisible();
  });

  test('should add result to comparison list', async ({ page }) => {
    await page.locator('#price').fill('1000');
    await page.locator('#pctOff').fill('20');
    await page.getByRole('button', { name: /計算/i }).click();
    await page.getByRole('button', { name: /比較リストに追加/i }).click();
    await expect(page.getByText('割引比較')).toBeVisible();
  });

  test('should support buyXgetY discount mode', async ({ page }) => {
    await page.locator('[role="combobox"]').first().click();
    await page.getByRole('option', { name: /X個買うとY個無料/i }).click();
    // Fields for buy X get Y should appear
    await expect(page.locator('#buyX')).toBeVisible();
    await expect(page.locator('#getY')).toBeVisible();
    await expect(page.locator('#totalItems')).toBeVisible();
  });
});
