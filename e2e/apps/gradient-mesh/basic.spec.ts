import { test, expect } from '@playwright/test';

test.describe('Gradient Mesh Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gradient-mesh');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Gradient Mesh Generator/i)).toBeVisible();
  });

  test('should render canvas with default color points', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should display default 4 color points in panel', async ({ page }) => {
    const colorInputs = page.locator('input[type="color"]');
    await expect(colorInputs).toHaveCount(4);
  });

  test('should add a new color point when clicking Add Point', async ({ page }) => {
    await page.getByRole('button', { name: /add point/i }).click();
    const colorInputs = page.locator('input[type="color"]');
    await expect(colorInputs).toHaveCount(5);
  });

  test('should remove a color point when clicking remove button', async ({ page }) => {
    await page.getByRole('button', { name: /remove point 1/i }).click();
    const colorInputs = page.locator('input[type="color"]');
    await expect(colorInputs).toHaveCount(3);
  });

  test('should show Copy CSS button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy css/i })).toBeVisible();
  });

  test('should show Download PNG button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /download png/i })).toBeVisible();
  });

  test('should show toast after clicking Copy CSS', async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.resolve() },
        configurable: true,
      });
    });
    await page.getByRole('button', { name: /copy css/i }).click();
    await expect(page.getByText(/css copied to clipboard/i).first()).toBeVisible();
  });
});
