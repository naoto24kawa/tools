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
    const output = page.locator('textarea').nth(1);
    await expect(output).toBeVisible({ timeout: 10000 });
    await expect(output).not.toHaveValue('', { timeout: 10000 });
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

    // Wait for the output card to appear: the second textarea is only rendered after encryption
    // completes. Use nth(1) so the locator fails until the output textarea is in the DOM.
    const outputArea = page.locator('textarea').nth(1);
    await expect(outputArea).toBeVisible({ timeout: 10000 });
    await expect(outputArea).not.toHaveValue('', { timeout: 10000 });
    const ciphertext = await outputArea.inputValue();
    expect(ciphertext.length).toBeGreaterThan(0);

    // Decrypt: fill input with ciphertext (passphrase is still set from encrypt step)
    await page.locator('textarea#input').fill(ciphertext);
    await expect(page.locator('textarea#input')).toHaveValue(ciphertext, { timeout: 5000 });

    await page.getByRole('button', { name: /^decrypt$/i }).click();

    // Wait for decrypted output to appear (PBKDF2 with 100k iterations can be slow)
    await expect(page.locator('textarea').nth(1)).toHaveValue(plaintext, { timeout: 15000 });
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
    await expect(page.getByText(/Decryption failed/i).first()).toBeVisible();
  });

  test('should clear all fields when Clear button is clicked', async ({ page }) => {
    await page.locator('textarea#input').fill('Some text');
    await page.locator('input#passphrase').fill('pass');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('textarea#input')).toHaveValue('');
    await expect(page.locator('input#passphrase')).toHaveValue('');
  });
});
