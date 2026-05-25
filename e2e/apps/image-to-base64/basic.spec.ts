import { test, expect } from '@playwright/test';

test.describe('Image to Base64', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-to-base64');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Base64|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    await expect(page.getByText(/ドラッグ&ドロップ/i)).toBeVisible();
  });

  test('should accept image file upload and show preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /アップロード画像プレビュー/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show Data URI output after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    const textarea = page.locator('textarea[aria-label="Data URI"]');
    await expect(textarea).toBeVisible({ timeout: 5000 });
    const value = await textarea.inputValue();
    expect(value).toContain('data:image');
  });

  test('should show Base64 Only output after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    const textarea = page.locator('textarea[aria-label="Base64 Only"]');
    await expect(textarea).toBeVisible({ timeout: 5000 });
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should show MIME type and size info after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    // Should show mime type like "image/png"
    await expect(page.getByText(/image\/png/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show Copy buttons for Data URI and Base64 Only', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img').first()).toBeVisible({ timeout: 5000 });
    const copyButtons = page.getByRole('button', { name: /Copy/i });
    await expect(copyButtons.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image to Base64/i })).toBeVisible();
  });
});
