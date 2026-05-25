import { test, expect } from '@playwright/test';

test.describe('Image Trim', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-trim');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Trim|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('should accept image file upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    // After upload, trim settings and preview should appear
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show trim settings after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // Should show "別の画像を選択" button indicating settings are shown
    await expect(page.getByRole('button', { name: /別の画像を選択/i })).toBeVisible();
  });

  test('should show reset button after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /別の画像を選択/i })).toBeVisible();
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Trim/i })).toBeVisible();
  });
});
