import { test, expect } from '@playwright/test';

test.describe('Image Transparent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-transparent');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Transparent|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    // Before image is uploaded, show upload component
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('should accept image file upload and show preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    // After upload, the canvas/preview should appear
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show settings panel after image upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    // Settings panel (Card) should appear with color picker and tolerance slider
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });
    // Tolerance slider should be visible
    await expect(page.locator('input[type="range"]').first()).toBeVisible();
  });

  test('should show eyedropper and color options after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });
    // Color picker should be visible
    await expect(page.locator('input[type="color"]').first()).toBeVisible();
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Transparent/i })).toBeVisible();
  });
});
