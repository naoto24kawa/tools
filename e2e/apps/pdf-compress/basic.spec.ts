import { test, expect } from '@playwright/test';

test.describe('PDF Compress', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-compress');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PDF Compress/i })).toBeVisible();
  });

  test('should show file upload drop zone', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Upload PDF file/i })).toBeVisible();
  });

  test('should have hidden file input accepting PDF', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('pdf');
  });

  test('should show "Click or drag and drop" hint', async ({ page }) => {
    await expect(page.getByText(/Click or drag and drop a PDF file here/i)).toBeVisible();
  });

  test('should show compress button disabled without file', async ({ page }) => {
    const compressBtn = page.getByRole('button', { name: /Compress PDF/i });
    await expect(compressBtn).toBeVisible();
    await expect(compressBtn).toBeDisabled();
  });

  test('should enable compress button after file selection', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\nxref\n0 1\n0000000000 65535 f\ntrailer\n<</Size 1/Root 1 0 R>>\nstartxref\n9\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'compress-me.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    await expect(page.getByText('compress-me.pdf')).toBeVisible();
    const compressBtn = page.getByRole('button', { name: /Compress PDF/i });
    await expect(compressBtn).toBeEnabled();
  });

  test('should show clear button', async ({ page }) => {
    const clearBtn = page.getByRole('button', { name: /Clear/i });
    await expect(clearBtn).toBeVisible();
  });
});
