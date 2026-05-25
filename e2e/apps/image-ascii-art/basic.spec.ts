import { test, expect } from '@playwright/test';

test.describe('ASCII Art Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-ascii-art');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/ASCII|Image/i);
  });

  test('should show upload area and width slider', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    // Width slider should be visible by default
    await expect(page.locator('input[type="range"]')).toBeVisible();
  });

  test('should accept image file upload and generate ASCII art', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    // ASCII art pre block should appear
    await expect(page.locator('pre')).toBeVisible({ timeout: 5000 });
  });

  test('should show ASCII output with content after upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.locator('pre')).toBeVisible({ timeout: 5000 });
    const asciiText = await page.locator('pre').textContent();
    expect(asciiText).not.toBe('');
  });

  test('should show Copy ASCII button after conversion', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/shared/fixtures/test-image.png');
    await expect(page.getByRole('button', { name: /Copy ASCII/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show width control label', async ({ page }) => {
    await expect(page.getByText(/Width/i)).toBeVisible();
    await expect(page.getByText(/chars/i)).toBeVisible();
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ASCII Art Converter/i })).toBeVisible();
  });
});
