import { test, expect } from '@playwright/test';

test.describe('Video Speed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/video-speed');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Video Speed/i)).toBeVisible();
  });

  test('should show file upload input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await expect(fileInput).toBeAttached();
  });

  test('should show page description about speed change', async ({ page }) => {
    await expect(
      page.getByText(/Change video playback speed/i)
    ).toBeVisible();
  });

  test('should not show Speed Settings before file upload', async ({ page }) => {
    await expect(page.getByText(/Speed Settings/i)).not.toBeVisible();
  });

  test('should show speed settings after file upload', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const blob = new Blob(['fake video data'], { type: 'video/mp4' });
      const file = new File([blob], 'test.mp4', { type: 'video/mp4' });
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText(/Speed Settings/i)).toBeVisible({ timeout: 3000 });
    // Speed range slider should appear
    await expect(page.locator('input[type="range"]')).toBeVisible();
  });

  test('should show speed preset buttons after file upload', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const blob = new Blob(['fake video data'], { type: 'video/mp4' });
      const file = new File([blob], 'test.mp4', { type: 'video/mp4' });
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText(/Speed Settings/i)).toBeVisible({ timeout: 3000 });
    // Preset buttons like 0.5x, 1x, 1.5x, 2x etc.
    await expect(page.getByRole('button', { name: /1\.0x|1x/i }).first()).toBeVisible();
  });

  test('should show Apply Speed Change button after file upload', async ({ page }) => {
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
      page.getByRole('button', { name: /apply speed change/i })
    ).toBeVisible({ timeout: 3000 });
  });

  test('should show Preview button after file upload', async ({ page }) => {
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
      page.getByRole('button', { name: /preview at/i })
    ).toBeVisible({ timeout: 3000 });
  });
});
