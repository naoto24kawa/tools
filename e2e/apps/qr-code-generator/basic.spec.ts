import { test, expect } from '@playwright/test';

test.describe('QR Code Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qr-code-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('QR Code Generator')).toBeVisible();
  });

  test('should show placeholder text when no input', async ({ page }) => {
    await expect(page.getByText(/enter text to generate a qr code/i)).toBeVisible();
  });

  test('should generate QR code image when text is entered', async ({ page }) => {
    await page.locator('textarea#qr-text').fill('https://example.com');
    // QR code is generated reactively via useEffect, no button needed
    await expect(page.locator('img[alt="Generated QR Code"]')).toBeVisible({ timeout: 5000 });
  });

  test('should hide placeholder after text is entered', async ({ page }) => {
    await page.locator('textarea#qr-text').fill('hello world');
    await expect(page.getByText(/enter text to generate a qr code/i)).not.toBeVisible();
  });

  test('should enable download PNG button when QR is generated', async ({ page }) => {
    await page.locator('textarea#qr-text').fill('test');
    await expect(page.getByRole('button', { name: /download png/i })).toBeEnabled({ timeout: 5000 });
  });

  test('should enable download SVG button when QR is generated', async ({ page }) => {
    await page.locator('textarea#qr-text').fill('test');
    await expect(page.getByRole('button', { name: /download svg/i })).toBeEnabled({ timeout: 5000 });
  });

  test('should clear QR code when clear all is clicked', async ({ page }) => {
    await page.locator('textarea#qr-text').fill('test input');
    await expect(page.locator('img[alt="Generated QR Code"]')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /clear all/i }).click();
    await expect(page.locator('textarea#qr-text')).toHaveValue('');
    await expect(page.locator('img[alt="Generated QR Code"]')).not.toBeVisible();
  });

  test('should have error correction level selector', async ({ page }) => {
    await expect(page.locator('#error-correction')).toBeVisible();
  });

  test('should have width and margin inputs', async ({ page }) => {
    await expect(page.locator('#width')).toBeVisible();
    await expect(page.locator('#margin')).toBeVisible();
  });
});
