import { test, expect } from '@playwright/test';

test.describe('Screen Recorder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/screen-recorder');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Screen Recorder')).toBeVisible();
  });

  test('should show start recording button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /start recording/i })).toBeVisible();
  });

  test('should show format selector', async ({ page }) => {
    await expect(page.locator('#format')).toBeVisible();
  });

  test('should not show stop recording button initially', async ({ page }) => {
    await expect(page.getByRole('button', { name: /stop recording/i })).not.toBeVisible();
  });

  test('should not show download button before recording', async ({ page }) => {
    await expect(page.getByRole('button', { name: /download/i })).not.toBeVisible();
  });

  test('should show recording controls card', async ({ page }) => {
    await expect(page.getByText('Recording Controls')).toBeVisible();
  });
});
