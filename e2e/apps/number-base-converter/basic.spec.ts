import { test, expect } from '@playwright/test';

test.describe('Number Base Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/number-base-converter');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Base Converter/i);
    await expect(page.getByRole('heading', { name: /Number Base Converter/i })).toBeVisible();
  });

  test('should show converter UI elements', async ({ page }) => {
    await expect(page.getByLabel('変換元 基数')).toBeVisible();
    await expect(page.getByLabel('変換先 基数')).toBeVisible();
    await expect(page.getByLabel('Input')).toBeVisible();
  });

  test('should convert decimal 255 to hexadecimal', async ({ page }) => {
    // Default: fromBase=10, toBase=16
    const input = page.getByLabel('Input');
    await input.fill('255');
    await expect(page.locator('code').first()).toContainText('ff');
  });

  test('should convert decimal 10 to binary', async ({ page }) => {
    const fromBaseSelect = page.getByLabel('変換元 基数');
    const toBaseSelect = page.getByLabel('変換先 基数');
    await fromBaseSelect.selectOption('10');
    await toBaseSelect.selectOption('2');
    const input = page.getByLabel('Input');
    await input.fill('10');
    await expect(page.locator('code').first()).toContainText('1010');
  });

  test('should convert decimal 255 to octal', async ({ page }) => {
    const fromBaseSelect = page.getByLabel('変換元 基数');
    const toBaseSelect = page.getByLabel('変換先 基数');
    await fromBaseSelect.selectOption('10');
    await toBaseSelect.selectOption('8');
    const input = page.getByLabel('Input');
    await input.fill('255');
    await expect(page.locator('code').first()).toContainText('377');
  });

  test('should show all bases display when input is provided', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('16');
    await expect(page.getByText(/Base 2/)).toBeVisible();
    await expect(page.getByText(/Base 8/)).toBeVisible();
    await expect(page.getByText(/Base 10/)).toBeVisible();
    await expect(page.getByText(/Base 16/)).toBeVisible();
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('255');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should enable copy button when there is output', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('10');
    const copyButton = page.getByRole('button', { name: /結果をコピー/i });
    await expect(copyButton).toBeEnabled();
  });
});
