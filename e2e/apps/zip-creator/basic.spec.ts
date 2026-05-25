import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('ZIP Creator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zip-creator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('ZIP Creator')).toBeVisible();
  });

  test('should show file upload area', async ({ page }) => {
    await expect(page.getByText('Add Files')).toBeVisible();
    await expect(page.getByText('Drop files or click to upload')).toBeVisible();
    await expect(page.getByRole('button', { name: /choose files/i })).toBeVisible();
  });

  test('should not show file list before any upload', async ({ page }) => {
    await expect(page.getByRole('button', { name: /create zip/i })).not.toBeVisible();
  });

  test('should show file list after uploading files', async ({ page }) => {
    // Create a simple test file via the hidden input
    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Hello, World!'),
    });

    // File list card should appear
    await expect(page.getByText('Files (1)')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('test.txt')).toBeVisible();
  });

  test('should show total size when files are added', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Sample content'),
    });

    await expect(page.getByText(/total:/i)).toBeVisible({ timeout: 3000 });
  });

  test('should allow removing a file from the list', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'remove-me.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('To be removed'),
    });

    await expect(page.getByText('remove-me.txt')).toBeVisible({ timeout: 3000 });

    // Click the remove button (ghost button inside the file row)
    await page.getByRole('button', { name: '' }).filter({ has: page.locator('svg') }).last().click();
    await expect(page.getByText('remove-me.txt')).not.toBeVisible({ timeout: 2000 });
  });

  test('should show compress checkbox when files are added', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('content'),
    });

    await expect(page.getByText('Files (1)')).toBeVisible({ timeout: 3000 });
    // Compress checkbox
    const compressCheckbox = page.locator('input[type="checkbox"]');
    await expect(compressCheckbox).toBeChecked();
  });

  test('should allow clearing all files', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'file1.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('content1'),
    });

    await expect(page.getByText('Files (1)')).toBeVisible({ timeout: 3000 });
    await page.getByRole('button', { name: /clear all/i }).click();

    // File list should disappear
    await expect(page.getByText('Files (')).not.toBeVisible({ timeout: 2000 });
  });
});
