import { test, expect } from '@playwright/test';

test.describe('PDF Password Protection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-password');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PDF Password Protection/i })).toBeVisible();
  });

  test('should show encrypt and decrypt sections', async ({ page }) => {
    await expect(page.getByText(/Encrypt PDF/i).first()).toBeVisible();
    await expect(page.getByText(/Decrypt PDF/i).first()).toBeVisible();
  });

  // --- Encrypt section ---

  test('should show encrypt file input', async ({ page }) => {
    const encryptFileInput = page.locator('input#encrypt-file[type="file"]');
    await expect(encryptFileInput).toBeAttached();
    const accept = await encryptFileInput.getAttribute('accept');
    expect(accept).toContain('pdf');
  });

  test('should show password input in encrypt section', async ({ page }) => {
    const passwordInput = page.locator('input#encrypt-password[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('should show confirm password input in encrypt section', async ({ page }) => {
    const confirmInput = page.locator('input#encrypt-confirm[type="password"]');
    await expect(confirmInput).toBeVisible();
  });

  test('should show encrypt button disabled without file and password', async ({ page }) => {
    const encryptBtn = page.getByRole('button', { name: /^Encrypt$/i });
    await expect(encryptBtn).toBeVisible();
    await expect(encryptBtn).toBeDisabled();
  });

  test('should show passwords do not match error', async ({ page }) => {
    await page.locator('input#encrypt-password').fill('password123');
    await page.locator('input#encrypt-confirm').fill('different456');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
  });

  test('should enable encrypt button when file and matching passwords are provided', async ({ page }) => {
    const encryptFileInput = page.locator('input#encrypt-file[type="file"]');
    const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\nxref\n0 1\n0000000000 65535 f\ntrailer\n<</Size 1/Root 1 0 R>>\nstartxref\n9\n%%EOF';
    await encryptFileInput.setInputFiles([
      { name: 'secure.pdf', mimeType: 'application/pdf', buffer: Buffer.from(pdfContent) },
    ]);

    await page.locator('input#encrypt-password').fill('mypassword');
    await page.locator('input#encrypt-confirm').fill('mypassword');

    const encryptBtn = page.getByRole('button', { name: /^Encrypt$/i });
    await expect(encryptBtn).toBeEnabled();
  });

  // --- Decrypt section ---

  test('should show decrypt file input', async ({ page }) => {
    const decryptFileInput = page.locator('input#decrypt-file[type="file"]');
    await expect(decryptFileInput).toBeAttached();
    const accept = await decryptFileInput.getAttribute('accept');
    expect(accept).toContain('encrypted');
  });

  test('should show password input in decrypt section', async ({ page }) => {
    const decryptPasswordInput = page.locator('input#decrypt-password[type="password"]');
    await expect(decryptPasswordInput).toBeVisible();
  });

  test('should show decrypt button disabled without file and password', async ({ page }) => {
    const decryptBtn = page.getByRole('button', { name: /^Decrypt$/i });
    await expect(decryptBtn).toBeVisible();
    await expect(decryptBtn).toBeDisabled();
  });

  test('should show clear buttons for both sections', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Clear encrypt form/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear decrypt form/i })).toBeVisible();
  });
});
