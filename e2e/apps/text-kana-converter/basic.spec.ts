import { test, expect } from '@playwright/test';

test.describe('Kana Converter - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-kana-converter');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Kana Converter/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display kana mode options', async ({ page }) => {
    await expect(page.getByText('変換モード')).toBeVisible();
  });

  test('should convert hiragana to katakana by default', async ({ page }) => {
    const input = page.locator('#input');
    // あいうえお → アイウエオ
    await input.fill('あいうえお');
    const output = page.locator('#output');
    await expect(output).toHaveValue('アイウエオ');
  });

  test('should convert katakana to hiragana when mode is switched', async ({ page }) => {
    // Click the "to hiragana" option
    const modeButtons = page.locator('button[type="button"]');
    const buttonTexts = await modeButtons.allTextContents();
    const toHiraganaIndex = buttonTexts.findIndex(
      (t) => t.includes('ひらがな') || t.includes('カタカナ→ひらがな') || t.includes('toHiragana'),
    );
    if (toHiraganaIndex >= 0) {
      await modeButtons.nth(toHiraganaIndex).click();
    }
    const input = page.locator('#input');
    await input.fill('アイウエオ');
    const output = page.locator('#output');
    await expect(output).toHaveValue('あいうえお');
  });

  test('should show empty output for empty input', async ({ page }) => {
    await expect(page.locator('#output')).toHaveValue('');
  });

  test('should preserve non-kana characters', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('abc あいう 123');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain('abc');
    expect(value).toContain('123');
    // あいう should be converted to katakana
    expect(value).toContain('アイウ');
  });

  test('should handle mixed kana input', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('あいうアイウ');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('あいうえお');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button when output is present', async ({ page }) => {
    await page.locator('#input').fill('あいうえお');
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });
});
