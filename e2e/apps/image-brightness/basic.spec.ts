import { test, expect } from '@playwright/test';

test.describe('Image Brightness/Contrast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-brightness');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Brightness|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    await expect(page.getByText(/画像を選択/i)).toBeVisible();
  });

  test('should accept image file upload and show preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /調整中の画像/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show adjustment sliders after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // Brightness, Contrast, Saturate sliders
    const sliders = page.locator('input[type="range"]');
    await expect(sliders).toHaveCount(3);
  });

  test('should show Brightness, Contrast, Saturate labels after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Brightness/i)).toBeVisible();
    await expect(page.getByText(/Contrast/i)).toBeVisible();
    await expect(page.getByText(/Saturate/i)).toBeVisible();
  });

  test('should show Reset and Download buttons after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /Reset/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible();
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Brightness/i })).toBeVisible();
  });
});
