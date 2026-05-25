import { test, expect } from '@playwright/test';

test.describe('Charset Detector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/charset-detector');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Charset Detector/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Charset Detector' })).toBeVisible();
  });

  test('should show text paste area', async ({ page }) => {
    await expect(page.getByPlaceholder('Paste text here...')).toBeVisible();
  });

  test('should show file upload area', async ({ page }) => {
    await expect(page.getByText(/Click to select a file/i)).toBeVisible();
  });

  test('should detect UTF-8 encoding when ASCII text is pasted', async ({ page }) => {
    const textarea = page.getByPlaceholder('Paste text here...');
    await textarea.fill('Hello, World! This is plain ASCII text.');

    // Detection results should appear
    await expect(page.getByText('Detection Results')).toBeVisible();
    // UTF-8 or ASCII should be detected
    await expect(page.getByText(/UTF-8|ASCII/i).first()).toBeVisible();
  });

  test('should show hex view after text input', async ({ page }) => {
    const textarea = page.getByPlaceholder('Paste text here...');
    await textarea.fill('Hello');

    await expect(page.getByText('Hex View (first 256 bytes)')).toBeVisible();
    await expect(page.locator('pre').first()).toBeVisible();
  });

  test('should show decoded text after text input', async ({ page }) => {
    const textarea = page.getByPlaceholder('Paste text here...');
    await textarea.fill('Sample text for detection');

    await expect(page.getByText('Decoded Text')).toBeVisible();
    await expect(page.getByText('Sample text for detection')).toBeVisible();
  });

  test('should show confidence percentage in results', async ({ page }) => {
    await page.getByPlaceholder('Paste text here...').fill('Test input');
    await expect(page.getByText(/Confidence:/i)).toBeVisible();
  });

  test('should show Decode button for each detected encoding', async ({ page }) => {
    await page.getByPlaceholder('Paste text here...').fill('Hello World');
    await expect(page.getByRole('button', { name: /Decode/i }).first()).toBeVisible();
  });

  test('should click Decode button and update decoded text', async ({ page }) => {
    await page.getByPlaceholder('Paste text here...').fill('Hello World');
    await expect(page.getByText('Detection Results')).toBeVisible();
    // Click the first Decode button
    await page.getByRole('button', { name: /Decode/i }).first().click();
    await expect(page.getByText('Decoded Text')).toBeVisible();
  });

  test('should show Input section card', async ({ page }) => {
    await expect(page.getByText('Input')).toBeVisible();
    await expect(page.getByText(/Upload a text file or paste text/i)).toBeVisible();
  });
});
