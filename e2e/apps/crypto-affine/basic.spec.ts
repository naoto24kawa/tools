import { test, expect } from '@playwright/test';

test.describe('Affine Cipher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crypto-affine');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Affine Cipher/i })).toBeVisible();
  });

  test('should encrypt HELLO with a=5, b=8 (defaults)', async ({ page }) => {
    const input = page.locator('textarea#cipher-input');
    await input.fill('HELLO');
    // Affine E(x) = (5x + 8) mod 26: H(7)→43%26=17=R, E(4)→28%26=2=C, L(11)→63%26=11=L, O(14)→78%26=0=A → RCLLA
    const output = page.locator('textarea#cipher-output');
    await expect(output).toHaveValue('RCLLA');
  });

  test('should decrypt RCLLA with a=5, b=8 to HELLO', async ({ page }) => {
    await page.getByRole('button', { name: /^decrypt$/i }).click();
    const input = page.locator('textarea#cipher-input');
    await input.fill('RCLLA');
    const output = page.locator('textarea#cipher-output');
    await expect(output).toHaveValue('HELLO');
  });

  test('should encrypt and decrypt round-trip', async ({ page }) => {
    const input = page.locator('textarea#cipher-input');
    const output = page.locator('textarea#cipher-output');
    const plaintext = 'CRYPTOGRAPHY';

    await input.fill(plaintext);
    const ciphertext = await output.inputValue();
    expect(ciphertext).not.toBe('');
    expect(ciphertext).not.toBe(plaintext);

    // Decrypt
    await page.getByRole('button', { name: /^decrypt$/i }).click();
    await input.fill(ciphertext);
    await expect(output).toHaveValue(plaintext);
  });

  test('should change a parameter and produce different output', async ({ page }) => {
    const input = page.locator('textarea#cipher-input');
    const output = page.locator('textarea#cipher-output');
    await input.fill('HELLO');
    const result1 = await output.inputValue();

    // Change a to a different valid value (e.g., 7)
    await page.locator('select#param-a').selectOption('7');
    const result2 = await output.inputValue();
    expect(result1).not.toBe(result2);
  });

  test('should clear input with Clear button', async ({ page }) => {
    const input = page.locator('textarea#cipher-input');
    await input.fill('HELLO');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });
});
