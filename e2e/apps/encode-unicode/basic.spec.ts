import { test, expect } from '@playwright/test';

test.describe('Unicode Escape Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encode-unicode');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Unicode Escape/i })).toBeVisible();
  });

  test('should escape ASCII text to Unicode escape sequences', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('Hi');
    await page.getByRole('button', { name: /escape/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // 'H' = H, 'i' = i
    await expect(output).toHaveValue('\\u0048\\u0069');
  });

  test('should unescape Unicode sequences back to text', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('\\u0048\\u0069');
    await page.getByRole('button', { name: /unescape/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('Hi');
  });

  test('should escape Japanese characters to Unicode sequences', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('あ');
    await page.getByRole('button', { name: /escape/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // 'あ' = U+3042
    await expect(output).toHaveValue('\\u3042');
  });

  test('should unescape Japanese Unicode sequence back to character', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('\\u3042');
    await page.getByRole('button', { name: /unescape/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('あ');
  });

  test('should round-trip escape then unescape', async ({ page }) => {
    const original = 'Hello 世界';
    const input = page.getByRole('textbox').first();
    await input.fill(original);
    await page.getByRole('button', { name: /escape/i }).click();

    const output = page.getByRole('textbox').nth(1);
    const escaped = await output.inputValue();
    expect(escaped).not.toBe(original);

    await input.fill(escaped);
    await page.getByRole('button', { name: /unescape/i }).click();
    await expect(output).toHaveValue(original);
  });

  test('should show code points info when input is provided', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('A');
    // Code Points section should appear
    await expect(page.getByText(/Code Points/i)).toBeVisible();
    await expect(page.getByText(/U\+0041/)).toBeVisible();
  });

  test('should clear input and output when Clear is clicked', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('Hi');
    await page.getByRole('button', { name: /escape/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('');
  });

  test('should disable Escape and Unescape buttons when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /escape/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /unescape/i })).toBeDisabled();
  });
});
