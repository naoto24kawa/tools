import { test, expect } from '@playwright/test';

test.describe('GIF Frame Extractor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gif-frame-extractor');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('GIF Frame Extractor')).toBeVisible();
  });

  test('should show upload area', async ({ page }) => {
    await expect(page.getByText(/Drop GIF here or click to upload/i)).toBeVisible();
  });

  test('should show supported format info', async ({ page }) => {
    await expect(page.getByText(/Supports animated GIF files/i)).toBeVisible();
  });

  test('should not show extracted frames before upload', async ({ page }) => {
    await expect(page.getByText('Extracted Frames')).not.toBeVisible();
  });

  test('should have hidden file input accepting GIF', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="image/gif"]');
    await expect(fileInput).toBeAttached();
  });
});
