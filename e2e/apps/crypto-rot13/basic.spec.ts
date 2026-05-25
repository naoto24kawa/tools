import { test, expect } from '@playwright/test';

test.describe('ROT13 / ROT18 / ROT47', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crypto-rot13');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ROT13/i })).toBeVisible();
  });

  test('should apply ROT13 to "Hello, World!" reactively', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('Hello, World!');
    // ROT13("Hello, World!") = "Uryyb, Jbeyq!"
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue('Uryyb, Jbeyq!');
  });

  test('should be self-inverse: ROT13 applied twice returns original', async ({ page }) => {
    const input = page.locator('textarea#input');
    const output = page.locator('textarea#output');
    await input.fill('Hello, World!');
    const rotated = await output.inputValue();
    await input.fill(rotated);
    await expect(output).toHaveValue('Hello, World!');
  });

  test('should apply ROT13 to uppercase alphabet', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    // ROT13 of full alphabet = NOPQRSTUVWXYZABCDEFGHIJKLM
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue('NOPQRSTUVWXYZABCDEFGHIJKLM');
  });

  test('should switch to ROT18 and apply transformation', async ({ page }) => {
    await page.getByRole('button', { name: /ROT18/i }).click();
    const input = page.locator('textarea#input');
    await input.fill('Hello 123');
    const output = page.locator('textarea#output');
    const result = await output.inputValue();
    // ROT18 rotates letters by 13 and digits by 5: H→U, e→r, l→y, l→y, o→b, 1→6, 2→7, 3→8
    expect(result).toBe('Uryyb 678');
  });

  test('should clear input with Clear button', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('Hello');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });
});
