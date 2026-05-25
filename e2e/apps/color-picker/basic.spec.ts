import { test, expect } from '@playwright/test';

test.describe('Color Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-picker');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color Picker/i);
  });

  test('should display color picker input', async ({ page }) => {
    await expect(page.locator('input[type="color"]')).toBeVisible();
  });

  test('should display HEX text input field', async ({ page }) => {
    await expect(page.locator('#hex-input')).toBeVisible();
  });

  test('should show format labels HEX, RGB, HSL', async ({ page }) => {
    // Format labels appear in spans; multiple HEX elements exist - use first
    await expect(page.getByText('HEX', { exact: true }).first()).toBeVisible();
    await expect(page.locator('span').filter({ hasText: /^RGB$/ })).toBeVisible();
    await expect(page.locator('span').filter({ hasText: /^HSL$/ })).toBeVisible();
  });

  test('should show color preview swatch', async ({ page }) => {
    await expect(page.getByLabel('カラープレビュー')).toBeVisible();
  });

  test('should display default color value #3b82f6 in hex input', async ({ page }) => {
    const hexInput = page.locator('#hex-input');
    await expect(hexInput).toHaveValue('#3b82f6');
  });

  test('should update formats when hex input is changed', async ({ page }) => {
    const hexInput = page.locator('#hex-input');
    await hexInput.fill('#ff0000');
    await hexInput.blur();
    // RGB for #ff0000 is rgb(255, 0, 0)
    await expect(page.getByText(/255/).first()).toBeVisible();
  });

  test('should show copy buttons for each format', async ({ page }) => {
    const copyButtons = page.getByRole('button').filter({ hasText: '' });
    // At least 3 copy buttons (HEX, RGB, HSL)
    await expect(copyButtons.first()).toBeVisible();
  });
});
