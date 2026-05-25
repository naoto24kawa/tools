import { test, expect } from '@playwright/test';

test.describe('OCR - Image to Text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-ocr');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/OCR|Image/i);
  });

  test('should show upload area initially', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    await expect(page.getByText(/Click or drag & drop an image here/i)).toBeVisible();
  });

  test('should accept image file upload and show preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /Uploaded preview/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show language selector', async ({ page }) => {
    await expect(page.locator('#language')).toBeVisible();
  });

  test('should show Recognize Text button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Recognize Text/i })).toBeVisible();
  });

  test('should have Recognize Text button disabled before upload', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Recognize Text/i })).toBeDisabled();
  });

  test('should enable Recognize Text button after image upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('img', { name: /Uploaded preview/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /Recognize Text/i })).toBeEnabled();
  });

  test('should run OCR and show result text after recognition', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('button', { name: /Recognize Text/i })).toBeEnabled({ timeout: 5000 });
    await page.getByRole('button', { name: /Recognize Text/i }).click();
    // OCR result textarea should appear (Tesseract.js needs time)
    await expect(page.locator('textarea[aria-label="認識されたテキスト結果"]')).toBeVisible({ timeout: 30000 });
  });

  test('should show Clear button in result section after recognition', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('button', { name: /Recognize Text/i })).toBeEnabled({ timeout: 5000 });
    await page.getByRole('button', { name: /Recognize Text/i }).click();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible({ timeout: 30000 });
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /OCR - Image to Text/i })).toBeVisible();
  });
});
