import { test, expect } from '@playwright/test';

test.describe('YAML Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/yaml-validator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('YAML Validator')).toBeVisible();
  });

  test('should show YAML input textarea', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /yaml input/i });
    await expect(textarea).toBeVisible();
  });

  test('should show JSON output section', async ({ page }) => {
    await expect(page.getByText('JSON Output')).toBeVisible();
  });

  test('should validate valid YAML and show JSON output', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /yaml input/i });
    await textarea.fill('name: Alice\nage: 30');

    // JSON should appear in the pre element
    await expect(page.locator('pre')).toContainText('"name"');
    await expect(page.locator('pre')).toContainText('"Alice"');
  });

  test('should show error icon and message for invalid YAML', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /yaml input/i });
    await textarea.fill('key: : invalid');
    // Error alert should appear
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 3000 });
  });

  test('should load sample YAML', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    const textarea = page.getByRole('textbox', { name: /yaml input/i });
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
    // Sample contains Docker Compose
    expect(value).toContain('services:');
  });

  test('should clear input', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /yaml input/i });
    await textarea.fill('key: value');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(textarea).toHaveValue('');
  });

  test('should have copy JSON button disabled when no valid YAML', async ({ page }) => {
    const copyBtn = page.getByRole('button', { name: /copy json/i });
    await expect(copyBtn).toBeDisabled();
  });

  test('should enable copy JSON button after valid YAML input', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /yaml input/i });
    await textarea.fill('key: value');
    const copyBtn = page.getByRole('button', { name: /copy json/i });
    await expect(copyBtn).toBeEnabled();
  });
});
