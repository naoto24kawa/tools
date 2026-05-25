import { test, expect } from '@playwright/test';

test.describe('Audio Trim', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/audio-trim');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Audio Trim/i);
    await expect(page.getByRole('heading', { name: 'Audio Trim' })).toBeVisible();
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

  test('should not show Trim Editor before file upload', async ({ page }) => {
    // The trim editor card only appears after a file is loaded
    await expect(page.getByText('Trim Editor')).not.toBeVisible();
  });

  test('should not show waveform canvas before file upload', async ({ page }) => {
    await expect(page.locator('canvas')).not.toBeVisible();
  });

  test('should not show Preview or Download buttons before file upload', async ({ page }) => {
    await expect(page.getByRole('button', { name: /preview/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /download trimmed/i })).not.toBeVisible();
  });

  test('should show description about trim functionality', async ({ page }) => {
    await expect(page.getByText(/trim audio files/i)).toBeVisible();
  });
});
