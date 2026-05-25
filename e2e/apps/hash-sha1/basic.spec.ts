import { test, expect } from '@playwright/test';

test.describe('Hash SHA-1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hash-sha1');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /SHA-1/i })).toBeVisible();
  });

  test('should generate SHA-1 hash of "hello" on button click', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // SHA1("hello") = aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
    await expect(page.getByText('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d')).toBeVisible();
  });

  test('should generate SHA-1 hash for another known value', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('abc');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // SHA1("abc") = a9993e364706816aba3e25717850c26c9cd0d89d
    await expect(page.getByText('a9993e364706816aba3e25717850c26c9cd0d89d')).toBeVisible();
  });

  test('should disable Generate Hash button when input is empty', async ({ page }) => {
    const button = page.getByRole('button', { name: /generate hash/i });
    await expect(button).toBeDisabled();
  });

  test('should show copy button after hash is generated', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /generate hash/i }).click();
    await expect(page.getByRole('button', { name: /copy sha-1/i })).toBeVisible();
  });
});
