import { test, expect } from '@playwright/test';

test.describe('Webcam Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/webcam-test');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Webcam Test')).toBeVisible();
  });

  test('should show start button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible();
  });

  test('should not show stop button initially', async ({ page }) => {
    await expect(page.getByRole('button', { name: /stop/i })).not.toBeVisible();
  });

  test('should not show snapshot button initially', async ({ page }) => {
    await expect(page.getByRole('button', { name: /snapshot/i })).not.toBeVisible();
  });

  test('should show camera card', async ({ page }) => {
    await expect(page.getByText('Camera')).toBeVisible();
  });

  test('should have video element for camera preview', async ({ page }) => {
    const video = page.locator('video');
    await expect(video).toBeAttached();
  });
});
