import { test, expect } from '@playwright/test';

test.describe('Video Rotate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-rotate');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Video Rotate/i)).toBeVisible();
  });

  test('should show file upload input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await expect(fileInput).toBeAttached();
  });

  test('should show page description about rotation', async ({ page }) => {
    await expect(
      page.getByText(/Rotate and flip video files/i)
    ).toBeVisible();
  });

  test('should not show Transform controls before file upload', async ({ page }) => {
    await expect(page.getByText(/^Transform$/)).not.toBeVisible();
  });

  test('should show transform controls after file upload', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const blob = new Blob(['fake video data'], { type: 'video/mp4' });
      const file = new File([blob], 'test.mp4', { type: 'video/mp4' });
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText(/^Transform$/)).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole('button', { name: /90 CW/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /90 CCW/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /180/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /flip h/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /flip v/i })).toBeVisible();
  });

  test('should show Apply Transform button after file upload', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const blob = new Blob(['fake video data'], { type: 'video/mp4' });
      const file = new File([blob], 'test.mp4', { type: 'video/mp4' });
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(
      page.getByRole('button', { name: /apply transform/i })
    ).toBeVisible({ timeout: 3000 });
  });

  test('should show Reset button in transform controls', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const blob = new Blob(['fake video data'], { type: 'video/mp4' });
      const file = new File([blob], 'test.mp4', { type: 'video/mp4' });
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByRole('button', { name: /reset/i })).toBeVisible({ timeout: 3000 });
  });
});
