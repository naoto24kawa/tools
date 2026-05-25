import { test, expect } from '@playwright/test';

test.describe('Favicon Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-favicon');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Favicon|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    await expect(page.getByText(/画像を選択/i)).toBeVisible();
  });

  test('should accept image file upload and generate favicons', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    // Favicon images in multiple sizes should appear
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show multiple favicon size previews after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // Multiple size images should be generated
    const images = page.getByRole('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(1);
  });

  test('should show download buttons for each favicon size', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // Download buttons for each size should be visible
    const downloadButtons = page.getByRole('button');
    await expect(downloadButtons.first()).toBeVisible();
  });

  test('should show size labels like 16x16, 32x32 after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // Size labels like "16x16" should be visible
    await expect(page.getByText(/16x16/i)).toBeVisible({ timeout: 5000 });
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Favicon Generator/i })).toBeVisible();
  });
});
