import { test, expect } from '@playwright/test';

test.describe('PDF to Image', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-to-image');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PDF to Image/i })).toBeVisible();
  });

  test('should show file upload drop zone', async ({ page }) => {
    await expect(page.getByText(/Click or drag & drop a PDF file/i)).toBeVisible();
  });

  test('should have hidden file input accepting PDF', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('pdf');
  });

  test('should show format selector with PNG/JPEG options', async ({ page }) => {
    const formatSelect = page.locator('#format');
    await expect(formatSelect).toBeVisible();
  });

  test('should show scale input', async ({ page }) => {
    const scaleInput = page.locator('input#scale');
    await expect(scaleInput).toBeVisible();
    const min = await scaleInput.getAttribute('min');
    const max = await scaleInput.getAttribute('max');
    expect(min).toBe('0.5');
    expect(max).toBe('5');
  });

  test('should show quality input', async ({ page }) => {
    const qualityInput = page.locator('input#quality');
    await expect(qualityInput).toBeVisible();
  });

  test('should show convert button disabled without file', async ({ page }) => {
    const convertBtn = page.getByRole('button', { name: /^Convert$/i });
    await expect(convertBtn).toBeVisible();
    await expect(convertBtn).toBeDisabled();
  });

  test('should enable convert button after file selection', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\nxref\n0 1\n0000000000 65535 f\ntrailer\n<</Size 1/Root 1 0 R>>\nstartxref\n9\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'convert.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    const convertBtn = page.getByRole('button', { name: /^Convert$/i });
    await expect(convertBtn).toBeEnabled();
  });

  test('should show clear button', async ({ page }) => {
    const clearBtn = page.getByRole('button', { name: /Clear/i });
    await expect(clearBtn).toBeVisible();
  });

  test('should show file name after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'my-document.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    await expect(page.getByText('my-document.pdf')).toBeVisible();
  });
});
