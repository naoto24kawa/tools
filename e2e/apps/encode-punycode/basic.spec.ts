import { test, expect } from '@playwright/test';

test.describe('Punycode Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encode-punycode');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Punycode/i })).toBeVisible();
  });

  test('should encode internationalized domain to ASCII (Punycode)', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('日本語.jp');
    await page.getByRole('button', { name: /To ASCII/i }).click();
    // 日本語 encodes to xn--wgv71a309e
    const output = page.locator('code');
    await expect(output).toContainText('xn--wgv71a309e.jp');
  });

  test('should decode Punycode ASCII domain to Unicode', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('xn--wgv71a309e.jp');
    await page.getByRole('button', { name: /To Unicode/i }).click();
    const output = page.locator('code');
    await expect(output).toContainText('日本語.jp');
  });

  test('should pass through pure ASCII domain unchanged', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('example.com');
    await page.getByRole('button', { name: /To ASCII/i }).click();
    const output = page.locator('code');
    await expect(output).toContainText('example.com');
  });

  test('should encode domain with subdomain', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('日本語.jp');
    await page.getByRole('button', { name: /To ASCII/i }).click();
    const output = page.locator('code');
    const value = await output.textContent();
    expect(value?.trim()).toMatch(/^xn--/);
  });

  test('should clear input and output when Clear is clicked', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('日本語.jp');
    await page.getByRole('button', { name: /To ASCII/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should disable To ASCII and To Unicode buttons when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /To ASCII/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /To Unicode/i })).toBeDisabled();
  });
});
