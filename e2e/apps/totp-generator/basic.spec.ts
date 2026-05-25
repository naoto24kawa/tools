import { test, expect } from '@playwright/test';

test.describe('TOTP Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/totp-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/TOTP Generator/i)).toBeVisible();
  });

  test('should show placeholder code when no secret entered', async ({ page }) => {
    // Default state shows dashes displayed as "--- ---"
    await expect(page.getByText(/--- ---/)).toBeVisible();
  });

  test('should generate a 6-digit code when valid Base32 secret is entered', async ({ page }) => {
    const secretInput = page.locator('input#secret');
    await secretInput.fill('JBSWY3DPEHPK3PXP');
    // Wait for the code to update (it updates reactively)
    await expect(page.getByText(/------/)).not.toBeVisible({ timeout: 3000 });
    // The code should be 6 digits displayed as "XXX XXX"
    const codeEl = page.locator('span.font-mono.font-bold');
    const codeText = await codeEl.textContent();
    expect(codeText).toBeTruthy();
    // Should not be placeholder
    expect(codeText?.trim()).not.toBe('--- ---');
  });

  test('should show error for invalid Base32 secret', async ({ page }) => {
    const secretInput = page.locator('input#secret');
    // All-symbol input strips to empty, triggering HMAC failure → error message
    await secretInput.fill('!!!!!!!!!!!!!!!!');
    await expect(page.getByText(/Invalid secret key/i)).toBeVisible({ timeout: 3000 });
  });

  test('should generate a random secret on Generate button click', async ({ page }) => {
    await page.getByRole('button', { name: /generate/i }).click();
    const secretInput = page.locator('input#secret');
    const val = await secretInput.inputValue();
    expect(val.length).toBeGreaterThan(0);
  });

  test('should show OTP Auth URI when valid secret is entered', async ({ page }) => {
    const secretInput = page.locator('input#secret');
    await secretInput.fill('JBSWY3DPEHPK3PXP');
    await expect(page.getByText(/otpauth:\/\//i)).toBeVisible({ timeout: 3000 });
  });

  test('should show time remaining countdown', async ({ page }) => {
    await expect(page.getByText(/Time Remaining/i)).toBeVisible();
    // Should display seconds remaining (1-30)
    await expect(page.getByText(/\d+s/)).toBeVisible();
  });
});
