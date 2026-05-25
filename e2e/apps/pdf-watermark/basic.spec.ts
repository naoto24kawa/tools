import { test, expect } from '@playwright/test';

test.describe('PDF Watermark', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-watermark');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PDF Watermark/i })).toBeVisible();
  });

  test('should show file upload area', async ({ page }) => {
    await expect(page.getByText(/Click or drag & drop/i)).toBeVisible();
    await expect(page.getByText(/PDF files only/i)).toBeVisible();
  });

  test('should have hidden file input accepting PDF', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('pdf');
  });

  test('should show watermark text input', async ({ page }) => {
    const watermarkText = page.locator('input#watermark-text');
    await expect(watermarkText).toBeVisible();
  });

  test('should show font size range slider', async ({ page }) => {
    const fontSizeSlider = page.locator('input#font-size[type="range"]');
    await expect(fontSizeSlider).toBeVisible();
  });

  test('should show opacity range slider', async ({ page }) => {
    const opacitySlider = page.locator('input#opacity[type="range"]');
    await expect(opacitySlider).toBeVisible();
  });

  test('should show rotation range slider', async ({ page }) => {
    const rotationSlider = page.locator('input#rotation[type="range"]');
    await expect(rotationSlider).toBeVisible();
  });

  test('should show apply watermark button disabled without file and text', async ({ page }) => {
    const applyBtn = page.getByRole('button', { name: /Apply Watermark/i });
    await expect(applyBtn).toBeVisible();
    await expect(applyBtn).toBeDisabled();
  });

  test('should enable apply button when file and text are provided', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\nxref\n0 1\n0000000000 65535 f\ntrailer\n<</Size 1/Root 1 0 R>>\nstartxref\n9\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'watermark.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    const watermarkText = page.locator('input#watermark-text');
    await watermarkText.fill('CONFIDENTIAL');

    const applyBtn = page.getByRole('button', { name: /Apply Watermark/i });
    await expect(applyBtn).toBeEnabled();
  });

  test('should show download button (disabled) initially', async ({ page }) => {
    const downloadBtn = page.getByRole('button', { name: /Download/i });
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toBeDisabled();
  });

  test('should allow updating watermark text', async ({ page }) => {
    const watermarkText = page.locator('input#watermark-text');
    await watermarkText.clear();
    await watermarkText.fill('DRAFT');
    await expect(watermarkText).toHaveValue('DRAFT');
  });
});
