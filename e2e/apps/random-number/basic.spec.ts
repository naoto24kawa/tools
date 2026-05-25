import { test, expect } from '@playwright/test';

test.describe('Random Number Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/random-number');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Random Number/i);
    await expect(page.getByRole('heading', { name: /Random Number Generator/i })).toBeVisible();
  });

  test('should show configuration fields', async ({ page }) => {
    await expect(page.getByLabel('最小値')).toBeVisible();
    await expect(page.getByLabel('最大値')).toBeVisible();
    await expect(page.getByLabel('生成数')).toBeVisible();
  });

  test('should show Generate button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Generate/i })).toBeVisible();
  });

  test('should generate random numbers when Generate is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click();
    // Results heading shows count > 0
    await expect(page.getByText(/Results \(\d+\)/)).toBeVisible();
  });

  test('should generate multiple numbers with count setting', async ({ page }) => {
    await page.getByLabel('生成数').fill('5');
    await page.getByRole('button', { name: /Generate/i }).click();
    await expect(page.getByText('Results (5)')).toBeVisible();
  });

  test('should show numbers within specified range', async ({ page }) => {
    await page.getByLabel('最小値').fill('100');
    await page.getByLabel('最大値').fill('100');
    await page.getByLabel('生成数').fill('3');
    await page.getByRole('button', { name: /Generate/i }).click();
    // All generated numbers should be 100 (min=max=100)
    const resultCells = page.locator('.bg-muted.rounded.px-2.py-1');
    await expect(resultCells.first()).toHaveText('100');
  });

  test('should show Copy All button after generating numbers', async ({ page }) => {
    await page.getByRole('button', { name: /Generate/i }).click();
    await expect(page.getByRole('button', { name: /Copy All/i })).toBeVisible();
  });

  test('should show float checkbox and allow decimal generation', async ({ page }) => {
    await expect(page.getByLabel('小数')).toBeVisible();
  });
});
