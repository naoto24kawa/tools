import { test, expect } from '@playwright/test';

test.describe('Image to PDF', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-to-pdf');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image to PDF/i })).toBeVisible();
  });

  test('should show image upload drop zone', async ({ page }) => {
    await expect(page.getByText(/Drag & drop images here, or click to select files/i)).toBeVisible();
  });

  test('should have hidden file input accepting images (multiple)', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('image');
    const multiple = await fileInput.getAttribute('multiple');
    expect(multiple).not.toBeNull();
  });

  test('should show page size selector', async ({ page }) => {
    const pageSizeSelect = page.locator('#page-size');
    await expect(pageSizeSelect).toBeVisible();
  });

  test('should show fit mode selector', async ({ page }) => {
    const fitModeSelect = page.locator('#fit-mode');
    await expect(fitModeSelect).toBeVisible();
  });

  test('should show margin input', async ({ page }) => {
    const marginInput = page.locator('input#margin');
    await expect(marginInput).toBeVisible();
    const type = await marginInput.getAttribute('type');
    expect(type).toBe('number');
  });

  test('should show convert button disabled without images', async ({ page }) => {
    const convertBtn = page.getByRole('button', { name: /Convert to PDF/i });
    await expect(convertBtn).toBeVisible();
    await expect(convertBtn).toBeDisabled();
  });

  test('should show download button disabled without converted PDF', async ({ page }) => {
    const downloadBtn = page.getByRole('button', { name: /Download PDF/i });
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toBeDisabled();
  });

  test('should enable convert button and show image list after image upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    // 1x1 transparent PNG
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    await fileInput.setInputFiles([
      { name: 'photo.png', mimeType: 'image/png', buffer: pngBuffer },
    ]);

    // Image list card should appear
    await expect(page.getByText(/Images \(1\)/i)).toBeVisible();
    await expect(page.getByText('photo.png')).toBeVisible();

    const convertBtn = page.getByRole('button', { name: /Convert to PDF/i });
    await expect(convertBtn).toBeEnabled();
  });

  test('should show clear all button when images are loaded', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    await fileInput.setInputFiles([
      { name: 'test.png', mimeType: 'image/png', buffer: pngBuffer },
    ]);

    await expect(page.getByRole('button', { name: /Clear All/i })).toBeVisible();
  });

  test('should remove image from list when X button is clicked', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    await fileInput.setInputFiles([
      { name: 'removable.png', mimeType: 'image/png', buffer: pngBuffer },
    ]);

    await expect(page.getByText('removable.png')).toBeVisible();
    await page.getByRole('button', { name: /Remove removable\.png/i }).click();
    await expect(page.getByText('removable.png')).not.toBeVisible();
  });
});
