import { test, expect } from '@playwright/test';

test.describe('Responsive Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/responsive-preview');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Responsive Preview' })).toBeVisible();
  });

  test('should show URL input and Load button', async ({ page }) => {
    await expect(page.getByPlaceholder(/Enter URL/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load' })).toBeVisible();
  });

  test('should show placeholder message before URL is loaded', async ({ page }) => {
    await expect(page.getByText(/Enter a URL above and click Load to preview/i)).toBeVisible();
  });

  test('should show error toast for invalid URL', async ({ page }) => {
    await page.getByPlaceholder(/Enter URL/i).fill('http://[invalid');
    await page.getByRole('button', { name: 'Load' }).click();
    await expect(page.getByText('Invalid URL', { exact: true })).toBeVisible();
  });

  test('should show Single and Side-by-side view mode buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Single/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Side-by-side/i })).toBeVisible();
  });

  test('should show device preset buttons in single mode', async ({ page }) => {
    // Device presets include mobile/tablet/desktop options
    await expect(page.getByRole('button', { name: /Rotate/i })).toBeVisible();
  });

  test('should load iframe when valid URL is entered', async ({ page }) => {
    await page.getByPlaceholder(/Enter URL/i).fill('https://example.com');
    await page.getByRole('button', { name: 'Load' }).click();
    // iframe should appear with title "Preview"
    await expect(page.locator('iframe[title="Preview"]')).toBeVisible();
  });

  test('should show custom width and height inputs', async ({ page }) => {
    await expect(page.getByPlaceholder('W', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('H', { exact: true })).toBeVisible();
  });
});
