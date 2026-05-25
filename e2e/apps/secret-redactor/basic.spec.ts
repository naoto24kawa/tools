import { test, expect } from '@playwright/test';

test.describe('Secret Redactor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/secret-redactor');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Secret Redactor').first()).toBeVisible();
  });

  test('should show no secrets message for clean text', async ({ page }) => {
    await page.locator('textarea#input-text').fill('Hello, this is safe text with no secrets.');
    await expect(page.getByText('No secrets detected in the input text.')).toBeVisible();
  });

  test('should detect AWS access key in input', async ({ page }) => {
    await page.locator('textarea#input-text').fill('AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE');
    await expect(page.getByText(/AWS Keys/i)).toBeVisible();
    await expect(page.getByText(/Detected Secrets \(1\)/i)).toBeVisible();
  });

  test('should load sample text and detect multiple secrets', async ({ page }) => {
    await page.getByRole('button', { name: 'Load Sample' }).click();
    // Sample contains AWS key, GitHub token, JWT, etc.
    const detected = page.getByText(/Detected Secrets/i);
    await expect(detected).toBeVisible();
    // Should find more than 1 secret
    const text = await detected.textContent();
    const match = text?.match(/\((\d+)\)/);
    expect(Number(match?.[1])).toBeGreaterThan(1);
  });

  test('should show highlighted preview with red-marked secrets', async ({ page }) => {
    await page.locator('textarea#input-text').fill('API_TOKEN=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh12');
    await expect(page.getByText('Preview (secrets highlighted)')).toBeVisible();
    // Secret should be highlighted
    const highlight = page.locator('.bg-red-200');
    await expect(highlight.first()).toBeVisible();
  });

  test('should show redacted output', async ({ page }) => {
    await page.locator('textarea#input-text').fill('AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE');
    await expect(page.getByText('Redacted Output')).toBeVisible();
    // Redacted output contains [REDACTED] placeholder
    await expect(page.getByText(/\[REDACTED\]/i)).toBeVisible();
  });

  test('should replace input with redacted text when Redact In Place is clicked', async ({ page }) => {
    const textarea = page.locator('textarea#input-text');
    await textarea.fill('AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE');
    await page.getByRole('button', { name: 'Redact In Place' }).click();
    const value = await textarea.inputValue();
    expect(value).toContain('[REDACTED]');
    expect(value).not.toContain('AKIAIOSFODNN7EXAMPLE');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const textarea = page.locator('textarea#input-text');
    await textarea.fill('some text');
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(textarea).toHaveValue('');
  });

  test('should list supported detection patterns', async ({ page }) => {
    await expect(page.getByText('AWS Keys')).toBeVisible();
    await expect(page.getByText('GitHub Tokens')).toBeVisible();
    await expect(page.getByText('JWTs')).toBeVisible();
  });
});
