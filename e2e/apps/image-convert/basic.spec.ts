import { test, expect } from '@playwright/test';

test.describe('Image Convert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-convert');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Convert|Image/i);
  });

  test('should display format selection buttons', async ({ page }) => {
    // PNG, JPEG, WebP format buttons
    await expect(page.getByRole('button', { name: /PNG/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /JPEG/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /WebP/i })).toBeVisible();
  });

  test('should accept image file upload and show preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /Preview/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show download button after image upload and conversion', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show quality slider when JPEG format is selected', async ({ page }) => {
    await page.getByRole('button', { name: /JPEG/i }).click();
    await expect(page.locator('input[type="range"]')).toBeVisible();
  });

  test('should not show quality slider for PNG format', async ({ page }) => {
    await page.getByRole('button', { name: /PNG/i }).click();
    // PNG format has no quality slider
    await expect(page.locator('input[type="range"]')).not.toBeVisible();
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Format Converter/i })).toBeVisible();
  });
});
