import { test, expect } from '@playwright/test';

test.describe('PDF Split', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-split');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PDF Split/i })).toBeVisible();
  });

  test('should show file input for PDF upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]#pdf-upload');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('pdf');
  });

  test('should show clear button (initially disabled)', async ({ page }) => {
    const clearBtn = page.getByRole('button', { name: /クリア/i });
    await expect(clearBtn).toBeVisible();
    await expect(clearBtn).toBeDisabled();
  });

  test('should not show split settings before file is loaded', async ({ page }) => {
    // Split settings card only appears after file is loaded
    await expect(page.getByText(/分割設定/i)).not.toBeVisible();
  });

  test('should show split mode buttons after file upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]#pdf-upload');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    // Split mode buttons should appear (range / individual)
    await expect(page.getByRole('button', { name: /範囲指定/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /1ページずつ/i })).toBeVisible();
  });

  test('should show range input in range mode', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]#pdf-upload');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    await expect(page.locator('input#range-input')).toBeVisible({ timeout: 5000 });
    const placeholder = await page.locator('input#range-input').getAttribute('placeholder');
    expect(placeholder).toContain('1-3');
  });
});
