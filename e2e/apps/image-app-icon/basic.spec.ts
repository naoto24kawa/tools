import { test, expect } from '@playwright/test';

test.describe('App Icon Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-app-icon');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/App Icon|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    await expect(page.getByText(/画像を選択/i)).toBeVisible();
  });

  test('should accept image file upload and generate app icons', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    // App icon images should appear
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show multiple icon size previews after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // Multiple icons in a grid should be generated
    const images = page.getByRole('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(1);
  });

  test('should show download (DL) buttons for each icon size', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // DL buttons should appear
    await expect(page.getByRole('button', { name: /DL/i }).first()).toBeVisible({ timeout: 5000 });
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /App Icon Generator/i })).toBeVisible();
  });
});
