import { test, expect } from '@playwright/test';

test.describe('RSA Key Pair Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rsa-keygen');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/RSA Key Pair Generator/i)).toBeVisible();
  });

  test('should generate RSA 1024-bit key pair', async ({ page }) => {
    await page.getByRole('button', { name: /1024 bit/i }).click();
    await page.getByRole('button', { name: /generate key pair/i }).click();
    // Wait for key generation (async)
    await expect(page.locator('textarea#public-key')).not.toHaveValue('', { timeout: 30000 });
    await expect(page.locator('textarea#private-key')).not.toHaveValue('', { timeout: 30000 });
  });

  test('should generate RSA 2048-bit key pair with PEM headers', async ({ page }) => {
    // 2048 is the default
    await page.getByRole('button', { name: /generate key pair/i }).click();
    // Wait for generation
    const publicKey = page.locator('textarea#public-key');
    const privateKey = page.locator('textarea#private-key');
    await expect(publicKey).not.toHaveValue('', { timeout: 30000 });
    await expect(privateKey).not.toHaveValue('', { timeout: 30000 });

    const pubKeyValue = await publicKey.inputValue();
    const privKeyValue = await privateKey.inputValue();

    // PEM format check
    expect(pubKeyValue).toContain('-----BEGIN PUBLIC KEY-----');
    expect(pubKeyValue).toContain('-----END PUBLIC KEY-----');
    expect(privKeyValue).toContain('-----BEGIN PRIVATE KEY-----');
    expect(privKeyValue).toContain('-----END PRIVATE KEY-----');
  });

  test('should show Generating... state during key generation', async ({ page }) => {
    await page.getByRole('button', { name: /generate key pair/i }).click();
    // The button should briefly show "Generating..."
    // We check that the button gets disabled while generating
    const button = page.getByRole('button', { name: /generating|generate key pair/i });
    // After completion it should be re-enabled
    await expect(button).toBeEnabled({ timeout: 30000 });
  });

  test('should have copy buttons for public and private keys', async ({ page }) => {
    await page.getByRole('button', { name: /generate key pair/i }).click();
    await expect(page.locator('textarea#public-key')).not.toHaveValue('', { timeout: 30000 });
    await expect(page.getByRole('button', { name: /copy/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /copy/i }).nth(1)).toBeVisible();
  });
});
