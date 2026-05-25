import { test, expect } from '@playwright/test';

test.describe('Atbash Cipher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crypto-atbash');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Atbash Cipher/i })).toBeVisible();
  });

  test('should apply atbash to "HELLO" reactively', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('HELLO');
    // Atbash: H→S, E→V, L→O, L→O, O→L → SVOOL
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue('SVOOL');
  });

  test('should be self-inverse: atbash applied twice returns original', async ({ page }) => {
    const input = page.locator('textarea#input');
    const output = page.locator('textarea#output');
    await input.fill('HELLO');
    const rotated = await output.inputValue();
    await input.fill(rotated);
    await expect(output).toHaveValue('HELLO');
  });

  test('should preserve non-alphabetic characters', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('Hello, World! 123');
    // H→S, e→v, l→o, l→o, o→l, W→D, o→l, r→i, l→o, d→w
    const output = page.locator('textarea#output');
    const result = await output.inputValue();
    // Non-alpha preserved: ", ! 123" unchanged
    expect(result).toContain(',');
    expect(result).toContain('!');
    expect(result).toContain('123');
  });

  test('should convert full alphabet correctly', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    const output = page.locator('textarea#output');
    // Atbash of A-Z = Z-A
    await expect(output).toHaveValue('ZYXWVUTSRQPONMLKJIHGFEDCBA');
  });

  test('should clear input with Clear button', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('HELLO');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });
});
