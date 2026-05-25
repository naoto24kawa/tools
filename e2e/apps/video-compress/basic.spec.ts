import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Video Compress', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-compress');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Video Compress/i)).toBeVisible();
  });

  test('should show file upload input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await expect(fileInput).toBeAttached();
  });

  test('should show Upload Video card', async ({ page }) => {
    await expect(page.getByText(/Upload Video/i)).toBeVisible();
    await expect(page.getByText(/Select a video file to compress/i)).toBeVisible();
  });

  test('should not show compression settings before file upload', async ({ page }) => {
    await expect(page.getByText(/Compression Settings/i)).not.toBeVisible();
  });

  test('should show quality and resolution options after file upload', async ({ page }) => {
    // Create a minimal video-like blob (just to trigger UI without actual video processing)
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const blob = new Blob(['fake video data'], { type: 'video/mp4' });
      const file = new File([blob], 'test.mp4', { type: 'video/mp4' });
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText(/Compression Settings/i)).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/Quality/i)).toBeVisible();
    await expect(page.getByText(/Resolution/i)).toBeVisible();
  });

  test('should show Compress Video button after file upload', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const blob = new Blob(['fake video data'], { type: 'video/mp4' });
      const file = new File([blob], 'test.mp4', { type: 'video/mp4' });
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByRole('button', { name: /compress video/i })).toBeVisible({ timeout: 3000 });
  });
});
