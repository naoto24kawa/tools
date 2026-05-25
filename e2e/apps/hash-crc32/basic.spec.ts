import { test, expect } from '@playwright/test';

test.describe('Hash CRC32', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hash-crc32');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /CRC32/i })).toBeVisible();
  });

  test('should generate CRC32 checksum of "hello" reactively', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    // CRC32("hello") = 3610a686
    await expect(page.getByText('3610a686')).toBeVisible();
  });

  test('should generate CRC32 checksum of "123456789"', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('123456789');
    // CRC32("123456789") = cbf43926
    await expect(page.getByText('cbf43926')).toBeVisible();
  });

  test('should clear output when input is cleared', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await expect(page.getByText('3610a686')).toBeVisible();
    await input.clear();
    await expect(page.getByText('3610a686')).not.toBeVisible();
  });

  test('should show copy button when checksum is displayed', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await expect(page.getByRole('button', { name: /copy crc32/i })).toBeVisible();
  });
});
