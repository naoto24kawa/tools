import { test, expect } from '@playwright/test';

test.describe('Video Mute', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-mute');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Video Mute/i)).toBeVisible();
  });

  test('should show file upload input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await expect(fileInput).toBeAttached();
  });

  test('should show Upload Video card with description', async ({ page }) => {
    await expect(page.getByText(/Upload Video/i)).toBeVisible();
    await expect(page.getByText(/Select a video file to remove audio from/i)).toBeVisible();
  });

  test('should not show Remove Audio section before file upload', async ({ page }) => {
    await expect(page.getByText(/Remove Audio/i)).not.toBeVisible();
  });

  test('should show Remove Audio section after file upload', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const blob = new Blob(['fake video data'], { type: 'video/mp4' });
      const file = new File([blob], 'test.mp4', { type: 'video/mp4' });
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText(/Remove Audio/i)).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole('button', { name: /remove audio/i })).toBeVisible();
  });

  test('should show page description about audio removal', async ({ page }) => {
    await expect(
      page.getByText(/Remove audio from video files/i)
    ).toBeVisible();
  });
});
