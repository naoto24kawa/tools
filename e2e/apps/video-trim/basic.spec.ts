import { test, expect } from '@playwright/test';

test.describe('Video Trim', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-trim');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Video Trim')).toBeVisible();
  });

  test('should show upload video card', async ({ page }) => {
    await expect(page.getByText('Upload Video')).toBeVisible();
    await expect(page.getByText('Select a video file to trim.')).toBeVisible();
  });

  test('should show file input for video upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await expect(fileInput).toBeAttached();
  });

  test('should not show trim settings before video is loaded', async ({ page }) => {
    await expect(page.getByText('Trim Settings')).not.toBeVisible();
  });

  test('should not show result section before trimming', async ({ page }) => {
    await expect(page.getByText('Download Trimmed Video')).not.toBeVisible();
  });
});
