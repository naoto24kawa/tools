import { test, expect } from '@playwright/test';

test.describe('PDF Metadata', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-metadata');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PDF Metadata/i })).toBeVisible();
  });

  test('should show file upload drop zone', async ({ page }) => {
    await expect(page.getByText(/Click or drag a PDF file here/i)).toBeVisible();
  });

  test('should have hidden file input accepting PDF', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('pdf');
  });

  test('should not show metadata editor before file is loaded', async ({ page }) => {
    // Editable Metadata card is hidden until a file is loaded
    await expect(page.getByText(/Editable Metadata/i)).not.toBeVisible();
  });

  test('should not show save button before file is loaded', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Save & Download/i })).not.toBeVisible();
  });

  test('should show metadata fields after PDF upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'meta.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    await expect(page.locator('input#meta-title')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('input#meta-author')).toBeVisible();
    await expect(page.locator('input#meta-subject')).toBeVisible();
    await expect(page.locator('input#meta-creator')).toBeVisible();
  });

  test('should show read-only document info after PDF upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'meta.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    await expect(page.getByText(/Document Info/i)).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/Page Count/i)).toBeVisible();
  });

  test('should allow editing metadata title field', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'meta.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    const titleInput = page.locator('input#meta-title');
    await expect(titleInput).toBeVisible({ timeout: 8000 });
    await titleInput.fill('My Test Document');
    await expect(titleInput).toHaveValue('My Test Document');
  });
});
