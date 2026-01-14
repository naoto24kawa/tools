import { test, expect } from '@playwright/test';

test.describe('Text Counter - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-counter');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Text Counter/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Text Counter/i })).toBeVisible();
    await expect(page.getByText(/統計情報/i)).toBeVisible();
    await expect(page.getByText(/設定/i)).toBeVisible();
  });

  test('should count characters when typing', async ({ page }) => {
    const textarea = page.getByPlaceholder(/ここにテキストを入力/i);
    await textarea.fill('hello world');
    
    await expect(textarea).toHaveValue('hello world');
  });

  test('should have clear button', async ({ page }) => {
    const clearButton = page.getByRole('button', { name: /テキストをクリア/i });
    await expect(clearButton).toBeVisible();
  });

  test('should clear text when clear button is clicked', async ({ page }) => {
    const textarea = page.getByPlaceholder(/ここにテキストを入力/i);
    await textarea.fill('test text');
    
    const clearButton = page.getByRole('button', { name: /テキストをクリア/i });
    await clearButton.click();
    
    await expect(textarea).toHaveValue('');
  });
});
