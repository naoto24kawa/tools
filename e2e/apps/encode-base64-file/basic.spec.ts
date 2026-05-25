import path from 'node:path';
import { test, expect } from '@playwright/test';

test.describe('Base64 File Encoder / Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encode-base64-file');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Base64 File/i })).toBeVisible();
  });

  test('should show Encode section', async ({ page }) => {
    await expect(page.getByText('Encode (File to Base64)')).toBeVisible();
  });

  test('should show Decode section', async ({ page }) => {
    await expect(page.getByText('Decode (Base64 to File)')).toBeVisible();
  });

  test('should show file upload area', async ({ page }) => {
    await expect(page.getByText('ファイルを選択')).toBeVisible();
  });

  test('should encode a text file to Base64 using file input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    // Create a simple text file buffer
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });

    // Base64 output textarea should appear and contain valid Base64
    const outputTextarea = page.locator('textarea').first();
    await expect(outputTextarea).toBeVisible();
    const value = await outputTextarea.inputValue();
    // 'hello' in Base64 is 'aGVsbG8='
    expect(value).toBe('aGVsbG8=');
  });

  test('should show file name and size after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'hello.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });

    await expect(page.getByText(/hello\.txt/)).toBeVisible();
  });

  test('should enable Decode & Download button when Base64 input is filled', async ({ page }) => {
    const decodeInput = page.getByLabel('Base64 Input');
    await decodeInput.fill('aGVsbG8=');
    await expect(page.getByRole('button', { name: /decode & download/i })).toBeEnabled();
  });

  test('should disable Decode & Download button when Base64 input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /decode & download/i })).toBeDisabled();
  });
});
