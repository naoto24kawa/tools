import { test, expect } from '@playwright/test';

test.describe('HTTP Request Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/http-request-builder');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/HTTP Request Builder/i)).toBeVisible();
  });

  test('should show method selector, URL input, and Send button', async ({ page }) => {
    await expect(page.getByRole('combobox')).toBeVisible();
    await expect(page.getByPlaceholder(/https:\/\/api\.example\.com\/endpoint/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible();
  });

  test('should disable Send button when URL is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  test('should enable Send button when URL is filled', async ({ page }) => {
    await page.getByPlaceholder(/https:\/\/api\.example\.com\/endpoint/i).fill('https://httpbin.org/get');
    await expect(page.getByRole('button', { name: /send/i })).toBeEnabled();
  });

  test('should show Headers and Body tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^headers$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^body$/i })).toBeVisible();
  });

  test('should add a header row when clicking Add Header', async ({ page }) => {
    const initialRows = await page.getByPlaceholder('Header name').count();
    await page.getByRole('button', { name: /add header/i }).click();
    await expect(page.getByPlaceholder('Header name')).toHaveCount(initialRows + 1);
  });

  test('should switch to Body tab and show body type selector', async ({ page }) => {
    await page.getByRole('button', { name: /^body$/i }).click();
    await expect(page.getByText(/body type/i)).toBeVisible();
  });

  test('should show textarea when JSON body type is selected', async ({ page }) => {
    await page.getByRole('button', { name: /^body$/i }).click();
    // Open the body type select
    const bodyTypeCombobox = page.locator('[data-slot="select-trigger"]').last();
    await bodyTypeCombobox.click();
    await page.getByRole('option', { name: /^json$/i }).click();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should change HTTP method via dropdown', async ({ page }) => {
    const methodSelect = page.getByRole('combobox').first();
    await methodSelect.click();
    await page.getByRole('option', { name: /^post$/i }).click();
    await expect(methodSelect).toContainText('POST');
  });
});
