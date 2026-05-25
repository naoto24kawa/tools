import { test, expect } from '@playwright/test';

test.describe('Color Mixer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-mixer');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color Mixer/i);
  });

  test('should display two color picker inputs', async ({ page }) => {
    const colorPickers = page.locator('input[type="color"]');
    await expect(colorPickers.nth(0)).toBeVisible();
    await expect(colorPickers.nth(1)).toBeVisible();
  });

  test('should display ratio slider', async ({ page }) => {
    await expect(page.getByLabel('混合比率')).toBeVisible();
  });

  test('should show default color1 value #ff0000', async ({ page }) => {
    await expect(page.getByText('#ff0000').first()).toBeVisible();
  });

  test('should show default color2 value #0000ff', async ({ page }) => {
    await expect(page.getByText('#0000ff').first()).toBeVisible();
  });

  test('should display the mixed color result', async ({ page }) => {
    // Mixed color should be visible as a code element
    const mixedCode = page.locator('code.text-lg.font-mono.font-bold');
    await expect(mixedCode).toBeVisible();
    const mixedHex = await mixedCode.textContent();
    expect(mixedHex).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test('should display mix steps palette', async ({ page }) => {
    await expect(page.getByText('Mix Steps')).toBeVisible();
    // Should have 11 step buttons in the palette
    const stepButtons = page.locator('button[aria-label*="をコピー"]');
    const count = await stepButtons.count();
    expect(count).toBeGreaterThanOrEqual(11);
  });

  test('should show ratio label with percentage', async ({ page }) => {
    await expect(page.getByText(/Ratio: 50%/)).toBeVisible();
  });

  test('should show mixed color preview', async ({ page }) => {
    await expect(page.getByLabel(/混合カラープレビュー/)).toBeVisible();
  });
});
