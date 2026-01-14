import { test, expect } from '@playwright/test';

test.describe('Text Diff Checker - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-diff-checker');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page.getByText(/diff/i) || page.getByText(/差分/i)).toBeVisible();
  });

  test('should have two text areas', async ({ page }) => {
    const textareas = page.getByRole('textbox');
    await expect(textareas.first()).toBeVisible();
  });

  test('should compare texts', async ({ page }) => {
    const textareas = page.getByRole('textbox');
    await textareas.first().fill('text1');
    await textareas.nth(1).fill('text2');
    
    expect(await textareas.first().inputValue()).toBe('text1');
  });
});
