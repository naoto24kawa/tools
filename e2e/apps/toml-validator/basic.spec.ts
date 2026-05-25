import { test, expect } from '@playwright/test';

test.describe('TOML Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/toml-validator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/TOML Validator/i)).toBeVisible();
  });

  test('should validate valid TOML and show Valid TOML', async ({ page }) => {
    const textarea = page.getByLabel('TOML input');
    await textarea.fill('[section]\nkey = "value"\nenabled = true');
    await expect(page.getByText(/Valid TOML/i)).toBeVisible();
  });

  test('should show JSON output for valid TOML', async ({ page }) => {
    const textarea = page.getByLabel('TOML input');
    await textarea.fill('name = "test"\nvalue = 42');
    await expect(page.getByText(/"name"/)).toBeVisible();
    await expect(page.getByText(/"test"/)).toBeVisible();
  });

  test('should show error for invalid TOML', async ({ page }) => {
    const textarea = page.getByLabel('TOML input');
    await textarea.fill('[section\nkey = value without quotes');
    // Should show an error state (not "Valid TOML")
    await expect(page.getByText(/Valid TOML/i)).not.toBeVisible();
  });

  test('should load sample TOML on Sample button click', async ({ page }) => {
    await page.getByRole('button', { name: /sample/i }).click();
    const textarea = page.getByLabel('TOML input');
    await expect(textarea).not.toHaveValue('');
    const val = await textarea.inputValue();
    expect(val.length).toBeGreaterThan(0);
    await expect(page.getByText(/Valid TOML/i)).toBeVisible();
  });

  test('should clear input on trash button click', async ({ page }) => {
    const textarea = page.getByLabel('TOML input');
    await textarea.fill('[section]\nkey = "value"');
    // Click the trash icon button (Trash2)
    await page.getByRole('button').filter({ has: page.locator('svg') }).nth(1).click();
    await expect(textarea).toHaveValue('');
  });
});
