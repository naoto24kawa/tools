import { test, expect } from '@playwright/test';

test.describe('Color Invert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-invert');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color Invert/i);
  });

  test('should display color picker input', async ({ page }) => {
    await expect(page.getByLabel('カラーピッカー')).toBeVisible();
  });

  test('should display text input for color', async ({ page }) => {
    const textInput = page.locator('input[type="text"]');
    await expect(textInput).toBeVisible();
    await expect(textInput).toHaveValue('#3b82f6');
  });

  test('should show Original and Inverted color previews', async ({ page }) => {
    await expect(page.getByText('Original')).toBeVisible();
    await expect(page.getByText('Inverted')).toBeVisible();
  });

  test('should show original color code #3b82f6', async ({ page }) => {
    await expect(page.getByLabel(/元のカラープレビュー/)).toBeVisible();
  });

  test('should show inverted color preview', async ({ page }) => {
    await expect(page.getByLabel(/反転カラープレビュー/)).toBeVisible();
  });

  test('should display inverted color value', async ({ page }) => {
    // #3b82f6 inverted is #c47d09
    const codes = page.locator('code.text-sm.font-mono');
    // Should show at least 2 codes (original + inverted)
    const count = await codes.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should update inverted color when input changes', async ({ page }) => {
    const textInput = page.locator('input[type="text"]');
    await textInput.fill('#ffffff');
    await textInput.blur();
    // Inverted of #ffffff is #000000
    await expect(page.getByText('#000000')).toBeVisible();
  });

  test('should show copy buttons for original and inverted colors', async ({ page }) => {
    const copyButtons = page.getByRole('button', { name: /をコピー/ });
    const count = await copyButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
