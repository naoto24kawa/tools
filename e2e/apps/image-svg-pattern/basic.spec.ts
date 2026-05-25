import { test, expect } from '@playwright/test';

test.describe('SVG Pattern Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-svg-pattern');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/SVG Pattern|Pattern|Image/i);
  });

  test('should show pattern preview by default', async ({ page }) => {
    // Pattern preview div with role="img"
    const preview = page.locator('[role="img"][aria-label="生成されたSVGパターンプレビュー"]');
    await expect(preview).toBeVisible();
  });

  test('should show pattern type selection buttons', async ({ page }) => {
    // Pattern type buttons (grid, dots, diagonal etc.)
    const patternButtons = page.locator('.grid button');
    await expect(patternButtons.first()).toBeVisible();
  });

  test('should show size and stroke sliders', async ({ page }) => {
    const sliders = page.locator('input[type="range"]');
    await expect(sliders.first()).toBeVisible();
    const count = await sliders.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should show color and background color pickers', async ({ page }) => {
    const colorInputs = page.locator('input[type="color"]');
    await expect(colorInputs.first()).toBeVisible();
    const count = await colorInputs.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should show SVG code in textarea', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="生成されたSVGコード"]');
    await expect(textarea).toBeVisible();
    const value = await textarea.inputValue();
    expect(value).toContain('<svg');
  });

  test('should show Copy SVG button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy SVG/i })).toBeVisible();
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /SVG Pattern Generator/i })).toBeVisible();
  });
});
