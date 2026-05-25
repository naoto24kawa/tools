import { test, expect } from '@playwright/test';

test.describe('Enigma Cipher Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/enigma-cipher');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Enigma Cipher Simulator/i })).toBeVisible();
  });

  test('should encrypt input and produce non-empty output', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('HELLO');
    const output = page.locator('textarea#output');
    const result = await output.inputValue();
    expect(result.length).toBeGreaterThan(0);
    // Enigma never maps a letter to itself
    expect(result).not.toBe('HELLO');
  });

  test('should encrypt and decrypt round-trip (same config)', async ({ page }) => {
    const input = page.locator('textarea#input');
    const output = page.locator('textarea#output');
    const plaintext = 'HELLOWORLD';

    // Encrypt
    await input.fill(plaintext);
    const ciphertext = await output.inputValue();
    expect(ciphertext).not.toBe('');
    expect(ciphertext).not.toBe(plaintext);

    // Enigma is self-reciprocal: encrypting ciphertext with same config decrypts it
    await input.fill(ciphertext);
    await expect(output).toHaveValue(plaintext);
  });

  test('should show rotor selectors for all 3 rotors', async ({ page }) => {
    await expect(page.locator('select#rotor-select-0')).toBeVisible();
    await expect(page.locator('select#rotor-select-1')).toBeVisible();
    await expect(page.locator('select#rotor-select-2')).toBeVisible();
  });

  test('should produce different output when rotor configuration changes', async ({ page }) => {
    const input = page.locator('textarea#input');
    const output = page.locator('textarea#output');
    await input.fill('HELLO');
    const result1 = await output.inputValue();

    // Change rotor 1 from I to III
    await page.locator('select#rotor-select-0').selectOption('III');
    const result2 = await output.inputValue();
    expect(result1).not.toBe(result2);
  });

  test('should produce different output when rotor position changes', async ({ page }) => {
    const input = page.locator('textarea#input');
    const output = page.locator('textarea#output');
    await input.fill('HELLO');
    const result1 = await output.inputValue();

    // Change rotor position
    await page.locator('input#rotor-position-0').fill('5');
    await page.locator('input#rotor-position-0').dispatchEvent('input');
    const result2 = await output.inputValue();
    expect(result1).not.toBe(result2);
  });

  test('should only output uppercase letters from alphabetic input', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('ABCDE');
    const output = page.locator('textarea#output');
    const result = await output.inputValue();
    // Enigma output should only contain uppercase letters
    expect(result).toMatch(/^[A-Z]+$/);
  });
});
