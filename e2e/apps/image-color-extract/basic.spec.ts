import { test, expect } from '@playwright/test';

test.describe('Image Color Extractor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-color-extract');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color|Image/i);
  });

  test('should show upload area and count input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    // Color count number input
    await expect(page.locator('input[type="number"]')).toBeVisible();
  });

  test('should accept image file upload and show preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /ソース画像プレビュー/i })).toBeVisible({ timeout: 5000 });
  });

  test('should extract colors from uploaded image', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    // Color swatches should appear
    await expect(page.getByText(/Extracted Colors/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show color swatches after extraction', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByText(/Extracted Colors/i)).toBeVisible({ timeout: 5000 });
    // Color swatch buttons with aria-label
    const colorButtons = page.locator('[aria-label^="色 #"]');
    await expect(colorButtons.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show Copy All button after extraction', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('button', { name: /Copy All/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Color Extractor/i })).toBeVisible();
  });
});
