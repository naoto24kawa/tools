import { test, expect } from '@playwright/test';

test.describe('PDF Merge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-merge');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PDF Merge/i })).toBeVisible();
  });

  test('should show file upload drop zone', async ({ page }) => {
    // Drop zone button with text
    await expect(page.getByText(/Drop PDF files here/i)).toBeVisible();
  });

  test('should have hidden file input accepting PDF', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toContain('pdf');
    // multiple attribute should be present
    const multiple = await fileInput.getAttribute('multiple');
    expect(multiple).not.toBeNull();
  });

  test('should show merge button disabled without files', async ({ page }) => {
    const mergeBtn = page.getByRole('button', { name: /Merge & Download/i });
    await expect(mergeBtn).toBeVisible();
    await expect(mergeBtn).toBeDisabled();
  });

  test('should show "or click to browse" hint', async ({ page }) => {
    await expect(page.getByText(/or click to browse/i)).toBeVisible();
  });

  test('should add PDF files and enable merge button after two files', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    // Create two minimal PDF buffers (valid enough for the file type check)
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\nxref\n0 1\n0000000000 65535 f\ntrailer\n<</Size 1/Root 1 0 R>>\nstartxref\n9\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'file1.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
      { name: 'file2.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    // File list should appear
    await expect(page.getByText(/2 files selected/i)).toBeVisible();
    // Merge button should now be enabled
    const mergeBtn = page.getByRole('button', { name: /Merge & Download/i });
    await expect(mergeBtn).toBeEnabled();
  });

  test('should show clear all button when files are added', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'a.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);
    await expect(page.getByRole('button', { name: /Clear all/i })).toBeVisible();
  });

  test('should remove file when X button is clicked', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const pdfContent = '%PDF-1.4\n%%EOF';
    await fileInput.setInputFiles([
      { name: 'remove-me.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);
    await expect(page.getByText('remove-me.pdf')).toBeVisible();

    await page.getByRole('button', { name: /Remove remove-me\.pdf/i }).click();
    await expect(page.getByText('remove-me.pdf')).not.toBeVisible();
  });
});
