import { test, expect } from '@playwright/test';

test.describe('Image Flip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-flip');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Flip|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    await expect(page.getByText(/画像をクリックして選択/i)).toBeVisible();
  });

  test('should accept image file upload and show original preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /Original/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show flip direction buttons after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /Original/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /水平反転/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /垂直反転/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /両方/i })).toBeVisible();
  });

  test('should show flipped image after clicking horizontal flip', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /Original/i })).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /水平反転/i }).click();
    await expect(page.getByRole('img', { name: /Flipped/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show download button after flipping', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /Original/i })).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /水平反転/i }).click();
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Flip/i })).toBeVisible();
  });
});
