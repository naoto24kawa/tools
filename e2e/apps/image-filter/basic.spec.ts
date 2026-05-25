import { test, expect } from '@playwright/test';

test.describe('Image Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-filter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Filter|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    await expect(page.getByText(/画像を選択/i)).toBeVisible();
  });

  test('should accept image file upload and show preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /フィルター適用後プレビュー/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show filter sliders after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // Multiple filter sliders should be visible
    const sliders = page.locator('input[type="range"]');
    await expect(sliders.first()).toBeVisible();
  });

  test('should show filter labels after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Brightness:/i)).toBeVisible();
    await expect(page.getByText(/Contrast:/i)).toBeVisible();
    await expect(page.getByText(/Grayscale:/i)).toBeVisible();
  });

  test('should show preset buttons after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Presets/i)).toBeVisible();
  });

  test('should show Reset button after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /Reset/i })).toBeVisible();
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Filter/i })).toBeVisible();
  });
});
