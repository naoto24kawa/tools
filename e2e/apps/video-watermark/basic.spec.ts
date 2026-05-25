import { test, expect } from '@playwright/test';

test.describe('Video Watermark', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-watermark');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Video Watermark')).toBeVisible();
  });

  test('should show upload video card', async ({ page }) => {
    await expect(page.getByText('Upload Video')).toBeVisible();
    await expect(page.getByText('Select a video file to add a watermark to.')).toBeVisible();
  });

  test('should show file input for video upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await expect(fileInput).toBeAttached();
  });

  test('should not show watermark settings before video is loaded', async ({ page }) => {
    await expect(page.getByText('Watermark Settings')).not.toBeVisible();
  });

  test('should not show apply watermark button before video is loaded', async ({ page }) => {
    await expect(page.getByRole('button', { name: /apply watermark/i })).not.toBeVisible();
  });
});
