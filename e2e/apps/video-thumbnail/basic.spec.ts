import { test, expect } from '@playwright/test';

test.describe('Video Thumbnail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-thumbnail');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Video Thumbnail')).toBeVisible();
  });

  test('should show upload video card', async ({ page }) => {
    await expect(page.getByText('Upload Video')).toBeVisible();
    await expect(page.getByText('Extract thumbnails from video files')).toBeVisible();
  });

  test('should show file input for video upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await expect(fileInput).toBeAttached();
  });

  test('should not show capture frame button before video is loaded', async ({ page }) => {
    const captureBtn = page.getByRole('button', { name: /capture frame/i });
    await expect(captureBtn).not.toBeVisible();
  });

  test('should not show thumbnail gallery before any capture', async ({ page }) => {
    await expect(page.getByText('Captured Thumbnails')).not.toBeVisible();
  });
});
