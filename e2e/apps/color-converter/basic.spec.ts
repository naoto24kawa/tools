import { test, expect } from '@playwright/test';

test.describe('Color Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-converter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color Converter/i);
  });

  test('should display HEX input field', async ({ page }) => {
    await expect(page.locator('#hex')).toBeVisible();
  });

  test('should show color format outputs on load', async ({ page }) => {
    // Format labels appear in the results grid (multiple HEX elements exist - use first)
    await expect(page.getByText('HEX').first()).toBeVisible();
    await expect(page.getByText('RGB').first()).toBeVisible();
    await expect(page.getByText('HSL').first()).toBeVisible();
  });

  test('should show RGB values for default color #3b82f6', async ({ page }) => {
    // Default color is #3b82f6 which is rgb(59, 130, 246)
    // Values appear in code elements in the format grid
    await expect(page.locator('code').filter({ hasText: /^59$/ }).first()).toBeVisible();
    await expect(page.locator('code').filter({ hasText: /^130$/ }).first()).toBeVisible();
    await expect(page.locator('code').filter({ hasText: /^246$/ }).first()).toBeVisible();
  });

  test('should update color output when HEX input changes', async ({ page }) => {
    const hexInput = page.locator('#hex');
    await hexInput.fill('#ff0000');
    await hexInput.blur();
    // Red = rgb(255, 0, 0)
    await expect(page.getByText('255').first()).toBeVisible();
  });

  test('should display color picker input', async ({ page }) => {
    await expect(page.locator('input[type="color"]').first()).toBeVisible();
  });

  test('should display color preview swatch', async ({ page }) => {
    await expect(page.getByLabel('カラープレビュー')).toBeVisible();
  });

  test('should show HSL representation for default color', async ({ page }) => {
    // Default #3b82f6 - should show some HSL value with % and deg
    const code = page.locator('code').filter({ hasText: 'hsl' });
    await expect(code).toBeVisible();
  });
});
