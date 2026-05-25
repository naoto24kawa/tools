import { test, expect } from '@playwright/test';

test.describe('AES Encrypt / Decrypt', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/aes-encrypt');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /AES Encrypt \/ Decrypt/i })).toBeVisible();
  });

  test('should encrypt plaintext and produce non-empty output', async ({ page }) => {
    const password = page.getByPlaceholder('Enter password...');
    const input = page.locator('textarea#input');
    await password.fill('mypassword');
    await input.fill('Hello, World!');
    await page.getByRole('button', { name: /^encrypt$/i }).first().click();
    // AES-256-GCM output is Base64 encoded, non-empty
    const output = page.locator('textarea').last();
    await expect(output).not.toHaveValue('');
    const outputValue = await output.inputValue();
    expect(outputValue.length).toBeGreaterThan(0);
  });

  test('should encrypt then decrypt to recover original text (round-trip)', async ({ page }) => {
    const password = page.getByPlaceholder('Enter password...');
    const input = page.locator('textarea#input');
    const plaintext = 'Hello, World!';

    // Encrypt
    await password.fill('mypassword');
    await input.fill(plaintext);
    await page.getByRole('button', { name: /^encrypt$/i }).first().click();
    const outputArea = page.locator('textarea').last();
    await expect(outputArea).not.toHaveValue('');
    const ciphertext = await outputArea.inputValue();

    // Switch to decrypt mode
    await page.getByRole('button', { name: /^decrypt$/i }).first().click();
    await input.fill(ciphertext);
    await page.getByRole('button', { name: /^decrypt$/i }).last().click();
    await expect(outputArea).toHaveValue(plaintext);
  });

  test('should show error for wrong password during decryption', async ({ page }) => {
    const password = page.getByPlaceholder('Enter password...');
    const input = page.locator('textarea#input');

    // Encrypt with one password
    await password.fill('correctpassword');
    await input.fill('Secret text');
    await page.getByRole('button', { name: /^encrypt$/i }).first().click();
    const outputArea = page.locator('textarea').last();
    const ciphertext = await outputArea.inputValue();

    // Try to decrypt with wrong password
    await page.getByRole('button', { name: /^decrypt$/i }).first().click();
    await password.fill('wrongpassword');
    await input.fill(ciphertext);
    await page.getByRole('button', { name: /^decrypt$/i }).last().click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should disable process button when input or password is empty', async ({ page }) => {
    // Both empty
    await expect(page.getByRole('button', { name: /^encrypt$/i }).last()).toBeDisabled();

    // Only password filled
    const password = page.locator('input#password');
    await password.fill('pass');
    await expect(page.getByRole('button', { name: /^encrypt$/i }).last()).toBeDisabled();
  });
});
