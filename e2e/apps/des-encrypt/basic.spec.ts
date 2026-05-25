import { test, expect } from '@playwright/test';

test.describe('DES Encrypt / Decrypt', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/des-encrypt');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /DES Encrypt \/ Decrypt/i })).toBeVisible();
  });

  test('should encrypt plaintext with 3DES and produce non-empty output', async ({ page }) => {
    // Switch to 3DES algorithm
    await page.getByRole('button', { name: /3DES/i }).click();
    const key = page.locator('input#key');
    const input = page.locator('textarea#input');
    await key.fill('mysecretkey');
    await input.fill('Hello, World!');
    await page.getByRole('button', { name: /^encrypt$/i }).last().click();
    const output = page.locator('textarea').last();
    await expect(output).not.toHaveValue('');
  });

  test('should encrypt then decrypt with 3DES to recover original text (round-trip)', async ({ page }) => {
    // Switch to 3DES
    await page.getByRole('button', { name: /3DES/i }).click();
    const key = page.locator('input#key');
    const input = page.locator('textarea#input');
    const plaintext = 'Hello, World!';

    // Encrypt
    await key.fill('mysecretkey');
    await input.fill(plaintext);
    await page.getByRole('button', { name: /^encrypt$/i }).last().click();
    const outputArea = page.locator('textarea').last();
    await expect(outputArea).not.toHaveValue('');
    const ciphertext = await outputArea.inputValue();

    // Decrypt
    await page.getByRole('button', { name: /^decrypt$/i }).first().click();
    await input.fill(ciphertext);
    await page.getByRole('button', { name: /^decrypt$/i }).last().click();
    await expect(outputArea).toHaveValue(plaintext);
  });

  test('should encrypt then decrypt with AES-256-GCM to recover original text (round-trip)', async ({ page }) => {
    const key = page.locator('input#key');
    const input = page.locator('textarea#input');
    const plaintext = 'AES round-trip test';

    // AES-256-GCM is selected by default
    await key.fill('aespassword');
    await input.fill(plaintext);
    await page.getByRole('button', { name: /^encrypt$/i }).last().click();
    const outputArea = page.locator('textarea').last();
    await expect(outputArea).not.toHaveValue('');
    const ciphertext = await outputArea.inputValue();

    // Decrypt
    await page.getByRole('button', { name: /^decrypt$/i }).first().click();
    await input.fill(ciphertext);
    await page.getByRole('button', { name: /^decrypt$/i }).last().click();
    await expect(outputArea).toHaveValue(plaintext);
  });

  test('should disable process button when input or key is empty', async ({ page }) => {
    // Both empty - the last encrypt/decrypt process button
    const processButton = page.getByRole('button', { name: /^encrypt$/i }).last();
    await expect(processButton).toBeDisabled();
  });
});
