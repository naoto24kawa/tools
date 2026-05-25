import { test, expect } from '@playwright/test';

test.describe('Vigenere Cipher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crypto-vigenere');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Vigenere Cipher/i })).toBeVisible();
  });

  test('should encrypt HELLO with key SECRET', async ({ page }) => {
    const keyInput = page.locator('input#key');
    const input = page.locator('textarea#input');
    await keyInput.fill('SECRET');
    await input.fill('HELLO');
    // Vigenere: H+S=Z, E+E=I, L+C=N, L+R=C, O+E=S → ZINCS
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue('ZINCS');
  });

  test('should decrypt ZINCS with key SECRET to HELLO', async ({ page }) => {
    await page.getByRole('button', { name: /^decrypt$/i }).click();
    const keyInput = page.locator('input#key');
    const input = page.locator('textarea#input');
    await keyInput.fill('SECRET');
    await input.fill('ZINCS');
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue('HELLO');
  });

  test('should encrypt and decrypt round-trip', async ({ page }) => {
    const keyInput = page.locator('input#key');
    const input = page.locator('textarea#input');
    const output = page.locator('textarea#output');
    const plaintext = 'ATTACKATDAWN';

    await keyInput.fill('LEMON');
    await input.fill(plaintext);
    const ciphertext = await output.inputValue();
    expect(ciphertext).not.toBe('');
    expect(ciphertext).not.toBe(plaintext);

    // Decrypt
    await page.getByRole('button', { name: /^decrypt$/i }).click();
    await input.fill(ciphertext);
    await expect(output).toHaveValue(plaintext);
  });

  test('should produce empty output when key is empty', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('HELLO');
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue('');
  });

  test('should ignore non-alphabetic characters in key input', async ({ page }) => {
    const keyInput = page.locator('input#key');
    await keyInput.fill('SECRET123!');
    // Non-alpha chars should be stripped
    await expect(keyInput).toHaveValue('SECRET');
  });

  test('should clear input with Clear button', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('HELLO');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });
});
