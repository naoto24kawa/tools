import { test, expect } from '@playwright/test';

test.describe('URL Parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/url-parser');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/URL Parser/i)).toBeVisible();
  });

  test('should parse URL components', async ({ page }) => {
    const input = page.getByPlaceholder(/https:\/\/example\.com/i);
    await input.fill('https://example.com:8080/path?key=value#section');
    await page.getByRole('button', { name: /^parse$/i }).click();

    // Multiple code elements show hostname; use first match
    await expect(page.getByText(/example\.com/).first()).toBeVisible();
    await expect(page.getByText(/8080/).first()).toBeVisible();
    await expect(page.getByText(/\/path/).first()).toBeVisible();
  });

  test('should show protocol component after parsing', async ({ page }) => {
    const input = page.getByPlaceholder(/https:\/\/example\.com/i);
    await input.fill('https://example.com/');
    await page.getByRole('button', { name: /^parse$/i }).click();
    await expect(page.getByText('https:', { exact: true })).toBeVisible();
  });

  test('should show query parameters table', async ({ page }) => {
    const input = page.getByPlaceholder(/https:\/\/example\.com/i);
    await input.fill('https://example.com/search?q=hello&lang=en');
    await page.getByRole('button', { name: /^parse$/i }).click();
    await expect(page.getByText('Query Parameters')).toBeVisible();
    // Query params appear in a table - use cell role for unique matching
    await expect(page.getByRole('cell', { name: 'q', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'hello', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'lang', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'en', exact: true })).toBeVisible();
  });

  test('should show error for invalid URL', async ({ page }) => {
    const input = page.getByPlaceholder(/https:\/\/example\.com/i);
    await input.fill('not-a-valid-url');
    await page.getByRole('button', { name: /^parse$/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/invalid url/i)).toBeVisible();
  });

  test('should parse on Enter key press', async ({ page }) => {
    const input = page.getByPlaceholder(/https:\/\/example\.com/i);
    await input.fill('https://test.example.org/');
    await input.press('Enter');
    // Multiple elements show the hostname; use first match
    await expect(page.getByText(/test\.example\.org/).first()).toBeVisible();
  });

  test('should switch to Build Mode', async ({ page }) => {
    await page.getByRole('button', { name: /build mode/i }).click();
    await expect(page.getByText(/URL Builder/i)).toBeVisible();
  });

  test('should build URL from components', async ({ page }) => {
    await page.getByRole('button', { name: /build mode/i }).click();
    // Fill in hostname
    const hostnameInput = page.getByPlaceholder('example.com');
    await hostnameInput.fill('mysite.com');
    const pathnameInput = page.getByPlaceholder('/path/to/resource');
    await pathnameInput.fill('/api/v1');
    await page.getByRole('button', { name: /build url/i }).click();
    await expect(page.getByText(/mysite\.com/)).toBeVisible();
    await expect(page.getByText(/\/api\/v1/)).toBeVisible();
  });
});
