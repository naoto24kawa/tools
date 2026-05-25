import { test, expect } from '@playwright/test';

test.describe('Homoglyph Detector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/homoglyph-detector');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Homoglyph Detector/i)).toBeVisible();
  });

  test('should show textarea for input', async ({ page }) => {
    await expect(page.getByPlaceholder(/enter text to analyze/i)).toBeVisible();
  });

  test('should show security assessment when text is entered', async ({ page }) => {
    await page.getByPlaceholder(/enter text to analyze/i).fill('Hello World');
    await expect(page.getByText(/Security Assessment/i)).toBeVisible();
  });

  test('should detect safe text with no homoglyphs', async ({ page }) => {
    await page.getByPlaceholder(/enter text to analyze/i).fill('Hello World');
    // "No suspicious characters found" or similar safe message
    await expect(page.getByText(/safe|no suspicious/i)).toBeVisible();
  });

  test('should detect homoglyphs in Cyrillic lookalike text', async ({ page }) => {
    // Cyrillic 'а' (U+0430) looks like Latin 'a'
    await page.getByPlaceholder(/enter text to analyze/i).fill('аpple');
    await expect(page.getByText(/detected issues/i)).toBeVisible();
    await expect(page.getByText(/Cyrillic/i)).toBeVisible();
  });

  test('should show detected issues table with columns', async ({ page }) => {
    await page.getByPlaceholder(/enter text to analyze/i).fill('аpple');
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table).toContainText('Codepoint');
    await expect(table).toContainText('Script');
    await expect(table).toContainText('Risk');
  });

  test('should show Copy Cleaned Text button when homoglyphs detected', async ({ page }) => {
    await page.getByPlaceholder(/enter text to analyze/i).fill('аpple');
    await expect(page.getByRole('button', { name: /copy cleaned text/i })).toBeVisible();
  });

  test('should not show issues section for clean text', async ({ page }) => {
    await page.getByPlaceholder(/enter text to analyze/i).fill('Hello');
    await expect(page.getByText(/detected issues/i)).not.toBeVisible();
  });
});
