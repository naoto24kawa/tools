import { test, expect } from '@playwright/test';

test.describe('Math Percentage Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/math-percentage');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Percentage Calculator/i);
    await expect(page.getByRole('heading', { name: /Percentage Calculator/i })).toBeVisible();
  });

  test('should show all calculation sections', async ({ page }) => {
    await expect(page.getByText('AはBの何%?')).toBeVisible();
    await expect(page.getByText('AのB%は?')).toBeVisible();
    await expect(page.getByText('変化率')).toBeVisible();
    await expect(page.getByText('値にX%を加減')).toBeVisible();
  });

  test('should calculate what percent A is of B: 25 is 50% of 50', async ({ page }) => {
    await page.getByLabel('元の値 A').fill('25');
    await page.getByLabel('基準値 B').fill('50');
    // 25 is 50% of 50
    await expect(page.getByText(/50\.00%/)).toBeVisible();
  });

  test('should calculate percent of: 10% of 200 = 20', async ({ page }) => {
    await page.getByLabel('基準値 A').fill('200');
    await page.getByLabel('パーセント B').fill('10');
    // 10% of 200 = 20
    await expect(page.getByText(/20\.00/)).toBeVisible();
  });

  test('should calculate percent change from 100 to 120 = +20%', async ({ page }) => {
    await page.getByLabel('元の値').fill('100');
    await page.getByLabel('新しい値').fill('120');
    // Change from 100 to 120 is +20%
    await expect(page.getByText(/20\.00%/)).toBeVisible();
  });

  test('should calculate add and subtract percent: 100 with 20%', async ({ page }) => {
    await page.getByLabel('値').fill('100');
    await page.getByLabel('パーセント').fill('20');
    // 100 + 20% = 120, 100 - 20% = 80
    await expect(page.getByText(/加算/)).toBeVisible();
    await expect(page.getByText(/120\.00/)).toBeVisible();
    await expect(page.getByText(/減算/)).toBeVisible();
    await expect(page.getByText(/80\.00/)).toBeVisible();
  });
});
