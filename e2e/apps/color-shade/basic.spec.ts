import { test, expect } from '@playwright/test';

test.describe('Color Shade Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-shade');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color Shade/i);
  });

  test('should display base color picker input', async ({ page }) => {
    await expect(page.getByLabel('ベースカラーピッカー')).toBeVisible();
  });

  test('should display step count number input', async ({ page }) => {
    const stepInput = page.locator('input[type="number"]');
    await expect(stepInput).toBeVisible();
    await expect(stepInput).toHaveValue('10');
  });

  test('should display Tints section', async ({ page }) => {
    await expect(page.getByText('Tints (明色)')).toBeVisible();
  });

  test('should display Shades section', async ({ page }) => {
    await expect(page.getByText('Shades (暗色)')).toBeVisible();
  });

  test('should generate tint color swatches', async ({ page }) => {
    const tintButtons = page.locator('button[aria-label*="ティント"]');
    const count = await tintButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should generate shade color swatches', async ({ page }) => {
    const shadeButtons = page.locator('button[aria-label*="シェード"]');
    const count = await shadeButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show Copy All Colors button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy All Colors/i })).toBeVisible();
  });

  test('should update palette when base color text changes', async ({ page }) => {
    const textInput = page.locator('input[type="text"]');
    await textInput.fill('#ff0000');
    await textInput.blur();
    // Should still show tints and shades sections
    await expect(page.getByText('Tints (明色)')).toBeVisible();
    await expect(page.getByText('Shades (暗色)')).toBeVisible();
  });
});
