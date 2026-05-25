import { test, expect } from '@playwright/test';

test.describe('Hash MD5', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hash-md5');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /MD5/i })).toBeVisible();
  });

  test('should generate MD5 hash of "hello" reactively', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    // MD5("hello") = 5d41402abc4b2a76b9719d911017c592
    await expect(page.getByText('5d41402abc4b2a76b9719d911017c592')).toBeVisible();
  });

  test('should generate MD5 hash of empty string when input is cleared', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await expect(page.getByText('5d41402abc4b2a76b9719d911017c592')).toBeVisible();
    await input.clear();
    await expect(page.getByText('5d41402abc4b2a76b9719d911017c592')).not.toBeVisible();
  });

  test('should generate different hash for different input', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('world');
    // MD5("world") = 7d793037a0760186574b0282f2f435e7
    await expect(page.getByText('7d793037a0760186574b0282f2f435e7')).toBeVisible();
  });

  test('should show copy button when hash is displayed', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await expect(page.getByRole('button', { name: /copy md5 hash/i })).toBeVisible();
  });
});
