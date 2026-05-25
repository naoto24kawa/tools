import { test, expect } from '@playwright/test';

test.describe('URL Encoder - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/url-encoder');
  });

  test('should load the page successfully', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/URL Encoder/i);
  });

  test('should display the main heading', async ({ page }) => {
    // Check if the main heading is visible
    const heading = page.getByRole('heading', { name: /URL Encoder/i });
    await expect(heading).toBeVisible();
  });

  test('should display the description', async ({ page }) => {
    // Check if the description is visible
    const description = page.getByText(/Encode or decode URL components/i);
    await expect(description).toBeVisible();
  });

  test('should have input textarea', async ({ page }) => {
    // Check if the input textarea exists
    const textarea = page.getByRole('textbox').first();
    await expect(textarea).toBeVisible();
  });

  test('should have encode/decode buttons', async ({ page }) => {
    // Check if encode button exists (English label)
    const encodeButton = page.getByRole('button', { name: /^Encode/i });
    await expect(encodeButton).toBeVisible();

    // Check if decode button exists (English label)
    const decodeButton = page.getByRole('button', { name: /^Decode/i });
    await expect(decodeButton).toBeVisible();
  });

  test('should have clear button', async ({ page }) => {
    // App has a Clear button instead of a back link
    const clearButton = page.getByRole('button', { name: /clear/i });
    await expect(clearButton).toBeVisible();
  });
});
