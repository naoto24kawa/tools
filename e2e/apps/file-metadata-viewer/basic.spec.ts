import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Metadata Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-metadata-viewer');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/File Metadata Viewer/i);
    await expect(page.getByText('File Metadata Viewer')).toBeVisible();
  });

  test('should show upload area with Choose File button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /choose file/i })).toBeVisible();
    await expect(page.getByText(/drop a file or click to upload/i)).toBeVisible();
  });

  test('should show metadata after uploading a text file', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'hello.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Hello, World!'),
    });

    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
    await expect(page.getByText('hello.txt')).toBeVisible();
    await expect(page.getByText('.txt', { exact: true })).toBeVisible();
    await expect(page.getByText(/text\/plain/)).toBeVisible();
  });

  test('should show file size in formatted and bytes form', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('A'.repeat(1024)),
    });

    await expect(page.getByText(/1,024 bytes/)).toBeVisible();
  });

  test('should show Clear button after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test'),
    });

    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });

  test('should clear metadata when Clear button is clicked', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test'),
    });

    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
    await page.getByRole('button', { name: /clear/i }).click();
    // After clearing, the metadata card (with Clear button) should be gone
    await expect(page.getByRole('button', { name: /clear/i })).not.toBeVisible();
  });

  test('should show last modified date after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'dated.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('date test'),
    });

    await expect(page.getByText(/Last Modified/i)).toBeVisible();
  });
});
