import { test, expect } from '@playwright/test';

test.describe('QR Code Reader', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qr-code-reader');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('QR Code Reader')).toBeVisible();
  });

  test('should show upload drop zone', async ({ page }) => {
    await expect(page.getByText(/drag & drop your image here/i)).toBeVisible();
  });

  test('should show instruction to click to select file', async ({ page }) => {
    await expect(page.getByText('or click to select a file', { exact: true })).toBeVisible();
  });

  test('should have hidden file input accepting images', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    await expect(fileInput).toBeAttached();
  });

  test('should disable copy result button when no result', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy result/i })).toBeDisabled();
  });

  test('should show clear button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });

  test('should show upload image card', async ({ page }) => {
    await expect(page.getByText('Upload Image')).toBeVisible();
  });
});
