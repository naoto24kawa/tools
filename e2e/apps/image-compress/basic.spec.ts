import { test, expect } from '@playwright/test';

test.describe('Image Compress', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-compress');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Compress|Image/i);
  });

  test('should display quality slider', async ({ page }) => {
    await expect(page.locator('input[type="range"]').first()).toBeVisible();
  });

  test('should display format buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /JPEG/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /WebP/i })).toBeVisible();
  });

  test('should accept image file upload and show preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show compression result stats after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    // Compression stats (Before/After/Saved) should appear
    await expect(page.getByText(/Before/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/After/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show download button after upload and compression', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible({ timeout: 5000 });
  });

  test('should switch to WebP format', async ({ page }) => {
    await page.getByRole('button', { name: /WebP/i }).click();
    // After clicking WebP, it should be in active state
    const webpButton = page.getByRole('button', { name: /WebP/i });
    await expect(webpButton).toHaveClass(/bg-primary/);
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Compressor/i })).toBeVisible();
  });
});
