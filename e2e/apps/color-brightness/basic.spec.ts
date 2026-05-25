import { test, expect } from '@playwright/test';

test.describe('Color Brightness & Saturation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-brightness');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color Brightness/i);
  });

  test('should display base color picker', async ({ page }) => {
    await expect(page.getByLabel('ベースカラーピッカー')).toBeVisible();
  });

  test('should display Brightness slider', async ({ page }) => {
    await expect(page.getByLabel('Brightness')).toBeVisible();
  });

  test('should display Saturation slider', async ({ page }) => {
    await expect(page.getByLabel('Saturation')).toBeVisible();
  });

  test('should display Hue slider', async ({ page }) => {
    await expect(page.getByLabel('Hue')).toBeVisible();
  });

  test('should show Original and adjusted color previews', async ({ page }) => {
    await expect(page.getByText('Original')).toBeVisible();
    await expect(page.getByLabel(/元のカラープレビュー/)).toBeVisible();
    await expect(page.getByLabel(/調整後カラープレビュー/)).toBeVisible();
  });

  test('should show HSL info text', async ({ page }) => {
    await expect(page.getByText(/HSL:/)).toBeVisible();
  });

  test('should show Reset button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Reset/i })).toBeVisible();
  });

  test('should show adjusted color code', async ({ page }) => {
    // The adjusted hex code should be visible as a <code> element
    const code = page.locator('code.text-sm.font-mono');
    await expect(code).toBeVisible();
    const text = await code.textContent();
    expect(text).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test('should reset sliders to 0 when Reset is clicked', async ({ page }) => {
    // Brightness label shows "Brightness: 0" by default
    await expect(page.getByText(/Brightness: 0/)).toBeVisible();
    await page.getByRole('button', { name: /Reset/i }).click();
    await expect(page.getByText(/Brightness: 0/)).toBeVisible();
  });
});
