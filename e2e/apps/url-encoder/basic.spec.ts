import { test, expect } from '@playwright/test';

test.describe('URL Encoder - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the URL Encoder app
    await page.goto('/');
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
    const description = page.getByText(/URLのエンコード・デコードを行うツール/i);
    await expect(description).toBeVisible();
  });

  test('should have input textarea', async ({ page }) => {
    // Check if the input textarea exists
    const textarea = page.getByRole('textbox').first();
    await expect(textarea).toBeVisible();
  });

  test('should have encode/decode buttons', async ({ page }) => {
    // Check if encode button exists
    const encodeButton = page.getByRole('button', { name: /エンコード/i });
    await expect(encodeButton).toBeVisible();

    // Check if decode button exists
    const decodeButton = page.getByRole('button', { name: /デコード/i });
    await expect(decodeButton).toBeVisible();
  });

  test('should have "Tools トップに戻る" link', async ({ page }) => {
    // Check if the back to tools link exists
    const backLink = page.getByRole('link', { name: /Tools トップに戻る/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });
});
