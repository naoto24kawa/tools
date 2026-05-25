import { test, expect } from '@playwright/test';

test.describe('File Rename Batch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-rename-batch');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/File Rename Batch/i);
    await expect(page.getByText('File Rename Batch')).toBeVisible();
  });

  test('should show Add Files button and upload section', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add files/i })).toBeVisible();
  });

  test('should show empty preview message when no files uploaded', async ({ page }) => {
    await expect(page.getByText(/upload files to see rename preview/i)).toBeVisible();
  });

  test('should show preview counter after uploading file', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'photo.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image'),
    });

    await expect(page.getByText(/1 file/)).toBeVisible();
  });

  test('should apply prefix rule and show renamed preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'photo.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image'),
    });

    // Ensure Prefix rule is selected (default)
    await expect(page.getByText('Add Prefix')).toBeVisible();

    // Fill in prefix value
    const prefixInput = page.getByPlaceholder(/enter value/i);
    await prefixInput.fill('2024_');

    // Preview should show original -> new name
    await expect(page.getByText('photo.jpg')).toBeVisible();
    await expect(page.getByText('2024_photo.jpg')).toBeVisible();
  });

  test('should have rename rule type selector', async ({ page }) => {
    await expect(page.getByText('Rename Rule')).toBeVisible();
    await expect(page.getByText('Rule Type')).toBeVisible();
  });

  test('should show download all button when files are loaded', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('content'),
    });

    await expect(page.getByRole('button', { name: /download all/i })).toBeVisible();
  });

  test('should show clear all button when files are loaded', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('content'),
    });

    await expect(page.getByRole('button', { name: /clear all/i })).toBeVisible();
  });

  test('should clear files when Clear All is clicked', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('content'),
    });

    await expect(page.getByText(/1 file/)).toBeVisible();
    await page.getByRole('button', { name: /clear all/i }).click();
    await expect(page.getByText(/upload files to see rename preview/i)).toBeVisible();
  });
});
