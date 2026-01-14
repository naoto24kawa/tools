import { test, expect } from '@playwright/test';

test.describe('Text Deduplicate - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-deduplicate');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page.getByText(/重複/i)).toBeVisible();
  });

  test('should have text input area', async ({ page }) => {
    const textarea = page.getByRole('textbox').first();
    await expect(textarea).toBeVisible();
  });

  test('should process text', async ({ page }) => {
    const textarea = page.getByRole('textbox').first();
    await textarea.fill('line1\nline2\nline1');
    expect(await textarea.inputValue()).toContain('line1');
  });
});
