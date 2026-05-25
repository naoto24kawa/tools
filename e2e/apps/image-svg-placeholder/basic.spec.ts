import { test, expect } from '@playwright/test';

test.describe('SVG Placeholder Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-svg-placeholder');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/SVG Placeholder|Placeholder|Image/i);
  });

  test('should show placeholder preview image by default', async ({ page }) => {
    // Placeholder image is generated immediately
    await expect(page.getByRole('img', { name: /プレースホルダー画像プレビュー/i })).toBeVisible();
  });

  test('should show width and height number inputs', async ({ page }) => {
    const numberInputs = page.locator('input[type="number"]');
    await expect(numberInputs.first()).toBeVisible();
    const count = await numberInputs.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should show text input for custom label', async ({ page }) => {
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('should show SVG Code textarea', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="SVG Code"]');
    await expect(textarea).toBeVisible();
    const value = await textarea.inputValue();
    expect(value).toContain('<svg');
  });

  test('should show Data URI textarea', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="Data URI"]');
    await expect(textarea).toBeVisible();
    const value = await textarea.inputValue();
    expect(value).toContain('data:image/svg+xml');
  });

  test('should show IMG Tag textarea', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="IMG Tag"]');
    await expect(textarea).toBeVisible();
    const value = await textarea.inputValue();
    expect(value).toContain('<img');
  });

  test('should update preview when width is changed', async ({ page }) => {
    const widthInput = page.locator('input[type="number"]').first();
    await widthInput.fill('800');
    // SVG code should update
    const textarea = page.locator('textarea[aria-label="SVG Code"]');
    const value = await textarea.inputValue();
    expect(value).toContain('800');
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /SVG Placeholder Generator/i })).toBeVisible();
  });
});
