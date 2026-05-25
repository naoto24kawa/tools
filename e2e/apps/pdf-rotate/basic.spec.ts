import { test, expect } from '@playwright/test';

test.describe('PDF Rotate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-rotate');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PDF Rotate/i })).toBeVisible();
  });

  test('should show file input for PDF upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]#pdf-file');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('pdf');
  });

  test('should not show rotation settings before file is loaded', async ({ page }) => {
    // Rotation Angle select and Apply To select appear only after file load
    await expect(page.locator('#angle')).not.toBeVisible();
    await expect(page.locator('#page-target')).not.toBeVisible();
  });

  test('should show rotation angle and page target selectors after file upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]#pdf-file');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'rotate.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    await expect(page.getByLabel(/Rotation Angle/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByLabel(/Apply To/i)).toBeVisible();
  });

  test('should show rotate button after file upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]#pdf-file');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'rotate.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    await expect(page.getByRole('button', { name: /^Rotate$/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show specific pages input when "Specific Pages" mode is selected', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]#pdf-file');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'rotate.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    // Wait for settings to appear
    await expect(page.getByLabel(/Apply To/i)).toBeVisible({ timeout: 5000 });
    // Click the "Apply To" select trigger to open and choose "Specific Pages"
    await page.locator('#page-target').click();
    await page.getByRole('option', { name: /Specific Pages/i }).click();

    await expect(page.locator('input#specific-pages')).toBeVisible();
  });
});
