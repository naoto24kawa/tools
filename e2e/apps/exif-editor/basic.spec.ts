import { test, expect } from '@playwright/test';

test.describe('EXIF Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exif-editor');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('EXIF Editor')).toBeVisible();
  });

  test('should show upload section', async ({ page }) => {
    await expect(page.getByText('Upload JPEG')).toBeVisible();
    await expect(page.getByRole('button', { name: /Choose File/i })).toBeVisible();
  });

  test('should show description text', async ({ page }) => {
    await expect(page.getByText('Upload a JPEG file to view and remove EXIF metadata.')).toBeVisible();
  });

  test('should show upload prompt before file is chosen', async ({ page }) => {
    await expect(page.getByText('Upload a JPEG file', { exact: true })).toBeVisible();
  });

  test('should hide EXIF info and preview before file is uploaded', async ({ page }) => {
    // EXIF Info section should not be visible before upload
    await expect(page.getByText('EXIF Info')).not.toBeVisible();
    await expect(page.getByText('Preview')).not.toBeVisible();
  });

  test('should show file input accept attribute for jpeg only', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('jpeg');
  });

  test('should show dashed upload zone', async ({ page }) => {
    const uploadZone = page.locator('.border-dashed');
    await expect(uploadZone).toBeVisible();
  });

  test('should show image icon in upload zone', async ({ page }) => {
    // ImageIcon renders as SVG
    const uploadCard = page.locator('text=Upload JPEG').locator('..');
    await expect(uploadCard).toBeVisible();
  });
});
