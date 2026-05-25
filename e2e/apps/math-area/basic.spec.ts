import { test, expect } from '@playwright/test';

test.describe('Math Area Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/math-area');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Area Calculator/i);
    await expect(page.getByRole('heading', { name: /Area Calculator/i })).toBeVisible();
  });

  test('should show shape selector buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: '円', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '長方形' })).toBeVisible();
    await expect(page.getByRole('button', { name: '三角形' })).toBeVisible();
    await expect(page.getByRole('button', { name: '台形' })).toBeVisible();
    await expect(page.getByRole('button', { name: '楕円' })).toBeVisible();
    await expect(page.getByRole('button', { name: '正方形' })).toBeVisible();
  });

  test('should calculate circle area with radius 5 (≈78.54)', async ({ page }) => {
    // Circle is the default shape
    const radiusInput = page.getByLabel('半径');
    await radiusInput.fill('5');
    // π * 5^2 ≈ 78.5398
    await expect(page.getByText(/78\.5/)).toBeVisible();
  });

  test('should calculate rectangle area width=4 height=6 = 24', async ({ page }) => {
    await page.getByRole('button', { name: '長方形' }).click();
    await page.getByLabel('幅').fill('4');
    await page.getByLabel('高さ').fill('6');
    await expect(page.getByText('24')).toBeVisible();
  });

  test('should calculate triangle area base=6 height=4 = 12', async ({ page }) => {
    await page.getByRole('button', { name: '三角形' }).click();
    await page.getByLabel('底辺').fill('6');
    await page.getByLabel('高さ').fill('4');
    await expect(page.getByText('12')).toBeVisible();
  });

  test('should calculate square area side=5 = 25', async ({ page }) => {
    await page.getByRole('button', { name: '正方形' }).click();
    await page.getByLabel('一辺').fill('5');
    await expect(page.getByText('25')).toBeVisible();
  });

  test('should show 面積 label', async ({ page }) => {
    await expect(page.getByText('面積', { exact: true })).toBeVisible();
  });

  test('should switch shape and reset fields', async ({ page }) => {
    // Start with circle and enter radius
    await page.getByLabel('半径').fill('5');
    // Switch to rectangle — fields should reset
    await page.getByRole('button', { name: '長方形' }).click();
    await expect(page.getByLabel('幅')).toHaveValue('');
    await expect(page.getByLabel('高さ')).toHaveValue('');
  });
});
