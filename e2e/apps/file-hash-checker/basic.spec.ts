import { test, expect } from '@playwright/test';

test.describe('File Hash Checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-hash-checker');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('File Hash Checker')).toBeVisible();
  });

  test('should show Upload File section', async ({ page }) => {
    await expect(page.getByText('Upload File')).toBeVisible();
    await expect(page.getByRole('button', { name: /Choose File/i })).toBeVisible();
  });

  test('should show algorithm selector defaulting to SHA-256', async ({ page }) => {
    await expect(page.getByText('Algorithm')).toBeVisible();
    // SHA-256 should be selected by default
    const combobox = page.getByRole('combobox');
    await expect(combobox).toHaveText('SHA-256');
  });

  test('should show dashed upload zone', async ({ page }) => {
    await expect(page.locator('.border-dashed')).toBeVisible();
  });

  test('should show upload prompt before file is selected', async ({ page }) => {
    await expect(page.getByText('Drop a file or click to upload')).toBeVisible();
  });

  test('should not show Hash Result before file is uploaded', async ({ page }) => {
    await expect(page.getByText('Hash Result')).not.toBeVisible();
  });

  test('should compute hash from uploaded file', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Hello, World!'),
    });

    await expect(page.getByText('Hash Result')).toBeVisible({ timeout: 10000 });
    const hashDisplay = page.locator('pre');
    await expect(hashDisplay).not.toBeEmpty();
  });

  test('should show Compare Hash input after computing hash', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test data'),
    });

    await expect(page.getByText('Compare Hash (optional)')).toBeVisible({ timeout: 10000 });
  });

  test('should show hash match indicator when correct hash is pasted', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test'),
    });

    // Wait for hash to appear
    await expect(page.getByText('Hash Result')).toBeVisible({ timeout: 10000 });
    // Get the computed hash
    const hashText = await page.locator('pre').textContent();

    // Paste it in the compare field
    const compareInput = page.getByPlaceholder('Paste expected hash to compare...');
    await compareInput.fill(hashText?.trim() ?? '');

    await expect(page.getByText('Hashes match')).toBeVisible();
  });

  test('should show hash mismatch when wrong hash is pasted', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test'),
    });

    await expect(page.getByText('Hash Result')).toBeVisible({ timeout: 10000 });
    const compareInput = page.getByPlaceholder('Paste expected hash to compare...');
    await compareInput.fill('0000000000000000000000000000000000000000000000000000000000000000');

    await expect(page.getByText('Hashes do not match')).toBeVisible();
  });

  test('should support SHA-512 algorithm', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'SHA-512' }).click();
    await expect(page.getByRole('combobox')).toHaveText('SHA-512');
  });

  test('should support SHA-1 algorithm', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'SHA-1' }).click();
    await expect(page.getByRole('combobox')).toHaveText('SHA-1');
  });
});
