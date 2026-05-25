import { test, expect } from '@playwright/test';

test.describe('Hash HMAC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hash-hmac');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /HMAC Generator/i })).toBeVisible();
  });

  test('should generate HMAC-SHA256 for known message and secret', async ({ page }) => {
    const message = page.locator('textarea#message');
    const secret = page.locator('input#secret');
    await message.fill('hello');
    await secret.fill('secret');
    await page.getByRole('button', { name: /generate hmac/i }).click();
    // HMAC-SHA256("hello", "secret") = 88aab3ede8d3adf94d26ab90d3bafd4a2083070c3bcce9c014ee04a443847c0b
    await expect(page.getByText('88aab3ede8d3adf94d26ab90d3bafd4a2083070c3bcce9c014ee04a443847c0b')).toBeVisible();
  });

  test('should disable Generate HMAC button when message is empty', async ({ page }) => {
    const secret = page.locator('input#secret');
    await secret.fill('secret');
    const button = page.getByRole('button', { name: /generate hmac/i });
    await expect(button).toBeDisabled();
  });

  test('should disable Generate HMAC button when secret is empty', async ({ page }) => {
    const message = page.locator('textarea#message');
    await message.fill('hello');
    const button = page.getByRole('button', { name: /generate hmac/i });
    await expect(button).toBeDisabled();
  });

  test('should switch algorithm to SHA-1 and generate different HMAC', async ({ page }) => {
    const message = page.locator('textarea#message');
    const secret = page.locator('input#secret');
    await message.fill('hello');
    await secret.fill('secret');
    await page.getByRole('button', { name: 'HMAC-SHA1' }).click();
    await page.getByRole('button', { name: /generate hmac/i }).click();
    // HMAC-SHA1("hello", "secret") = 5112055c05f944f85755efc5cd8970e194e9f45b
    await expect(page.getByText('5112055c05f944f85755efc5cd8970e194e9f45b')).toBeVisible();
  });

  test('should show copy button after HMAC is generated', async ({ page }) => {
    const message = page.locator('textarea#message');
    const secret = page.locator('input#secret');
    await message.fill('hello');
    await secret.fill('secret');
    await page.getByRole('button', { name: /generate hmac/i }).click();
    await expect(page.getByRole('button', { name: /copy hmac/i })).toBeVisible();
  });
});
