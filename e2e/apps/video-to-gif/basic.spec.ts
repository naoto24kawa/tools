import { test, expect } from '@playwright/test';

test.describe('Video to GIF', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-to-gif');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Video to GIF')).toBeVisible();
  });

  test('should show video upload area', async ({ page }) => {
    await expect(page.getByText(/click to upload or drag and drop/i)).toBeVisible();
  });

  test('should show supported formats info', async ({ page }) => {
    await expect(page.getByText(/MP4, WebM, OGG, MOV/i)).toBeVisible();
  });

  test('should not show extraction options before video upload', async ({ page }) => {
    await expect(page.getByText('Extraction Options')).not.toBeVisible();
  });

  test('should show hidden file input for video', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await expect(fileInput).toBeAttached();
  });
});
