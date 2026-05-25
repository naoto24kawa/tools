import { test, expect } from '@playwright/test';

test.describe('Number Fraction Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/number-fraction');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Fraction/i);
    await expect(page.getByRole('heading', { name: /Fraction Calculator/i })).toBeVisible();
  });

  test('should show decimal to fraction section', async ({ page }) => {
    await expect(page.getByText(/小数 → 分数/)).toBeVisible();
    await expect(page.getByLabel('小数')).toBeVisible();
  });

  test('should convert 0.75 decimal to fraction 3/4', async ({ page }) => {
    const decimalInput = page.getByLabel('小数');
    await decimalInput.fill('0.75');
    // 3/4 should appear as fraction result
    await expect(page.getByText(/3\/4/)).toBeVisible();
  });

  test('should convert 0.5 decimal to fraction 1/2', async ({ page }) => {
    const decimalInput = page.getByLabel('小数');
    await decimalInput.fill('0.5');
    await expect(page.getByText(/1\/2/)).toBeVisible();
  });

  test('should show fraction arithmetic section', async ({ page }) => {
    await expect(page.getByText(/分数の演算/)).toBeVisible();
    await expect(page.getByLabel('分数1の分子')).toBeVisible();
    await expect(page.getByLabel('分数1の分母')).toBeVisible();
    await expect(page.getByLabel('分数2の分子')).toBeVisible();
    await expect(page.getByLabel('分数2の分母')).toBeVisible();
  });

  test('should add fractions 1/2 + 1/3 = 5/6', async ({ page }) => {
    await page.getByLabel('分数1の分子').fill('1');
    await page.getByLabel('分数1の分母').fill('2');
    await page.getByLabel('分数2の分子').fill('1');
    await page.getByLabel('分数2の分母').fill('3');
    // 1/2 + 1/3 = 5/6; use first() since 加算 also appears in the description text
    await expect(page.getByText(/加算/).first()).toBeVisible();
    await expect(page.getByText(/5\/6/)).toBeVisible();
  });

  test('should multiply fractions 1/2 x 1/3 = 1/6', async ({ page }) => {
    await page.getByLabel('分数1の分子').fill('1');
    await page.getByLabel('分数1の分母').fill('2');
    await page.getByLabel('分数2の分子').fill('1');
    await page.getByLabel('分数2の分母').fill('3');
    // 1/2 * 1/3 = 1/6; use first() since 乗算 also appears in the description text
    await expect(page.getByText(/乗算/).first()).toBeVisible();
    await expect(page.getByText(/1\/6/)).toBeVisible();
  });
});
