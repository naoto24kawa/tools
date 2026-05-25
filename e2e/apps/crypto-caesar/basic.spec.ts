import { test, expect } from '@playwright/test';

test.describe('Caesar Cipher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crypto-caesar');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Caesar Cipher/i })).toBeVisible();
  });

  test('should encrypt HELLO with shift=3 to KHOOR', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('HELLO');
    // shift is 3 by default
    // Caesar encrypt: H(7)+3=K, E(4)+3=H, L(11)+3=O, L(11)+3=O, O(14)+3=R → KHOOR
    const output = page.locator('textarea[readonly]').first();
    await expect(output).toHaveValue('KHOOR');
  });

  test('should decrypt KHOOR with shift=3 to HELLO', async ({ page }) => {
    await page.getByRole('button', { name: /^decrypt$/i }).click();
    const input = page.locator('textarea#input');
    await input.fill('KHOOR');
    const output = page.locator('textarea[readonly]').first();
    await expect(output).toHaveValue('HELLO');
  });

  test('should encrypt and decrypt round-trip', async ({ page }) => {
    const plaintext = 'ATTACK AT DAWN';
    const input = page.locator('textarea#input');
    const output = page.locator('textarea[readonly]').first();

    // Encrypt
    await input.fill(plaintext);
    const ciphertext = await output.inputValue();
    expect(ciphertext).not.toBe('');
    expect(ciphertext).not.toBe(plaintext);

    // Decrypt
    await page.getByRole('button', { name: /^decrypt$/i }).click();
    await input.fill(ciphertext);
    await expect(output).toHaveValue(plaintext);
  });

  test('should show brute force results', async ({ page }) => {
    await page.getByRole('button', { name: /brute force/i }).click();
    const input = page.locator('textarea#input');
    await input.fill('KHOOR');
    // Should show 26 shift results
    await expect(page.getByText(/shift \d+:/i).first()).toBeVisible();
  });

  test('should clear input with Clear button', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('HELLO');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });
});
