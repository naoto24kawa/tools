import { test, expect } from '@playwright/test';

test.describe('Text Encryption', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-encryption');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Text Encryption' })).toBeVisible();
  });

  test('should show text input and passphrase input', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
    await expect(page.locator('input#passphrase')).toBeVisible();
  });

  test('should have Encrypt and Decrypt buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /encrypt/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /decrypt/i })).toBeVisible();
  });

  test('should disable Encrypt and Decrypt buttons when inputs are empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /encrypt/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /decrypt/i })).toBeDisabled();
  });

  test('should enable Encrypt button when both text and passphrase are filled', async ({
    page,
  }) => {
    await page.locator('textarea#input').fill('Hello, World!');
    await page.locator('input#passphrase').fill('mypassword');
    await expect(page.getByRole('button', { name: /^encrypt$/i })).toBeEnabled();
  });

  test('should encrypt text and show output', async ({ page }) => {
    await page.locator('textarea#input').fill('Hello, World!');
    await page.locator('input#passphrase').fill('mypassword');
    await page.getByRole('button', { name: /^encrypt$/i }).click();
    const output = page.locator('textarea').last();
    await expect(output).not.toHaveValue('');
    const value = await output.inputValue();
    expect(value.length).toBeGreaterThan(0);
    // Encrypted output should not contain the original plaintext
    expect(value).not.toContain('Hello, World!');
  });

  test('should encrypt then decrypt to recover original plaintext', async ({ page }) => {
    const plaintext = 'Secret message 123!';
    const passphrase = 'strongpassword';

    // Encrypt
    await page.locator('textarea#input').fill(plaintext);
    await page.locator('input#passphrase').fill(passphrase);
    await page.getByRole('button', { name: /^encrypt$/i }).click();
    const outputArea = page.locator('textarea').last();
    await expect(outputArea).not.toHaveValue('');
    const ciphertext = await outputArea.inputValue();

    // Decrypt
    await page.locator('textarea#input').fill(ciphertext);
    await page.getByRole('button', { name: /^decrypt$/i }).click();
    await expect(outputArea).toHaveValue(plaintext);
  });

  test('should show error when decrypting with wrong passphrase', async ({ page }) => {
    // Encrypt first
    await page.locator('textarea#input').fill('Some text');
    await page.locator('input#passphrase').fill('correctpass');
    await page.getByRole('button', { name: /^encrypt$/i }).click();
    const outputArea = page.locator('textarea').last();
    const ciphertext = await outputArea.inputValue();

    // Decrypt with wrong passphrase
    await page.locator('textarea#input').fill(ciphertext);
    await page.locator('input#passphrase').fill('wrongpass');
    await page.getByRole('button', { name: /^decrypt$/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should clear all fields when Clear button is clicked', async ({ page }) => {
    await page.locator('textarea#input').fill('Some text');
    await page.locator('input#passphrase').fill('pass');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('textarea#input')).toHaveValue('');
    await expect(page.locator('input#passphrase')).toHaveValue('');
  });
});
