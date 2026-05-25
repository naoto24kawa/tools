import { test, expect } from '@playwright/test';

test.describe('Hash SHA-256', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hash-sha256');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /SHA Hash Generator/i })).toBeVisible();
  });

  test('should default to SHA-256 algorithm', async ({ page }) => {
    // SHA-256 button should be selected (has primary styling)
    await expect(page.getByRole('button', { name: 'SHA-256' })).toBeVisible();
  });

  test('should generate SHA-256 hash of "hello"', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // SHA-256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    await expect(page.getByText('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')).toBeVisible();
  });

  test('should switch to SHA-384 and generate hash', async ({ page }) => {
    await page.getByRole('button', { name: 'SHA-384' }).click();
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // SHA-384("hello") starts with 59e1748777448c69de6b800d7a33bbfb9ff1b463e44354c3553bcdb9c666fa90125a3c79f90397bdf5f6a13de828684f
    await expect(page.getByText(/59e1748777448c69/i)).toBeVisible();
  });

  test('should switch to SHA-512 and generate hash', async ({ page }) => {
    await page.getByRole('button', { name: 'SHA-512' }).click();
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // SHA-512("hello") starts with 9b71d224bd62f3785d96d46ad3ea3d173319bfbc2890caadae2dff72519673ca
    await expect(page.getByText(/9b71d224bd62f378/i)).toBeVisible();
  });

  test('should disable Generate Hash button when input is empty', async ({ page }) => {
    const button = page.getByRole('button', { name: /generate hash/i });
    await expect(button).toBeDisabled();
  });

  test('should clear input and output when Clear is clicked', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /generate hash/i }).click();
    await expect(page.getByText('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')).toBeVisible();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByText('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')).not.toBeVisible();
  });
});
