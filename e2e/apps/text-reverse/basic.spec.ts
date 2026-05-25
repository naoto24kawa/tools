import { test, expect } from '@playwright/test';

test.describe('Text Reverse - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-reverse');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Text Reverse/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display reverse mode options', async ({ page }) => {
    // 反転モードのパネルが表示されていること
    await expect(page.getByText('反転モード')).toBeVisible();
  });

  test('should reverse text by characters by default', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('hello');
    const output = page.locator('#output');
    await expect(output).toHaveValue('olleh');
  });

  test('should reverse multi-character text correctly', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('abcde');
    const output = page.locator('#output');
    await expect(output).toHaveValue('edcba');
  });

  test('should produce empty output for empty input', async ({ page }) => {
    const output = page.locator('#output');
    await expect(output).toHaveValue('');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should show empty output after clearing', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.locator('#output')).toHaveValue('');
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button when output is present', async ({ page }) => {
    await page.locator('#input').fill('hello');
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });
});
