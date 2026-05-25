import { test, expect } from '@playwright/test';

test.describe('Audio Speed Changer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/audio-speed');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Audio Speed/i);
    await expect(page.getByRole('heading', { name: 'Audio Speed Changer' })).toBeVisible();
  });

  test('should show Upload Audio card', async ({ page }) => {
    await expect(page.getByText('Upload Audio')).toBeVisible();
  });

  test('should show Select File button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /select file/i })).toBeVisible();
  });

  test('should have hidden file input accepting audio/*', async ({ page }) => {
    const fileInput = page.locator('#audio-file-input');
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toBe('audio/*');
  });

  test('should not show speed controls before file upload', async ({ page }) => {
    // Speed Settings card should not be visible before a file is loaded
    await expect(page.getByText('Speed Settings')).not.toBeVisible();
  });

  test('should not show preview/download buttons before file upload', async ({ page }) => {
    await expect(page.getByRole('button', { name: /preview/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /download/i })).not.toBeVisible();
  });
});
