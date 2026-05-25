import { test, expect } from '@playwright/test';

test.describe('Bcrypt Hash Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bcrypt-hash');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Bcrypt Hash Generator/i })).toBeVisible();
  });

  test('should generate a non-empty bcrypt hash', async ({ page }) => {
    const password = page.locator('input#password');
    await password.fill('mypassword');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // Bcrypt hashes always start with $2b$ or $2a$
    await expect(page.getByText(/^\$2[ab]\$/m)).toBeVisible({ timeout: 15000 });
  });

  test('should generate a hash matching bcrypt format', async ({ page }) => {
    const password = page.locator('input#password');
    await password.fill('testpassword');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // Wait for hash output (bcrypt is slow)
    await page.waitForFunction(
      () => document.querySelector('.font-mono.break-all')?.textContent?.startsWith('$2'),
      { timeout: 15000 }
    );
    const hashEl = page.locator('.font-mono.break-all');
    const hash = await hashEl.textContent();
    expect(hash).toMatch(/^\$2[ab]\$\d+\$/);
  });

  test('should verify correct password against generated hash', async ({ page }) => {
    const password = page.locator('input#password');
    await password.fill('correctpassword');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // Wait for hash
    await page.waitForFunction(
      () => document.querySelector('.font-mono.break-all')?.textContent?.startsWith('$2'),
      { timeout: 15000 }
    );
    const hash = await page.locator('.font-mono.break-all').textContent();

    // Now verify
    const verifyPassword = page.locator('input#verify-password');
    const verifyHashInput = page.locator('input#verify-hash');
    await verifyPassword.fill('correctpassword');
    await verifyHashInput.fill(hash!);
    await page.getByRole('button', { name: /^verify$/i }).click();
    await expect(page.getByText(/match.*correct/i)).toBeVisible({ timeout: 15000 });
  });

  test('should show mismatch for incorrect password verification', async ({ page }) => {
    const verifyPassword = page.locator('input#verify-password');
    const verifyHashInput = page.locator('input#verify-hash');
    // Use a known bcrypt hash for "correctpassword"
    await verifyPassword.fill('wrongpassword');
    await verifyHashInput.fill('$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
    await page.getByRole('button', { name: /^verify$/i }).click();
    await expect(page.getByText(/no match/i)).toBeVisible({ timeout: 15000 });
  });

  test('should disable Generate Hash button when password is empty', async ({ page }) => {
    const button = page.getByRole('button', { name: /generate hash/i });
    await expect(button).toBeDisabled();
  });
});
