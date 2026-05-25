import { test, expect } from '@playwright/test';

test.describe('package.json Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/package-json-validator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/package\.json Validator/i)).toBeVisible();
  });

  test('should show textarea input area', async ({ page }) => {
    await expect(page.locator('#json-input')).toBeVisible();
  });

  test('should disable Validate button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^Validate$/i })).toBeDisabled();
  });

  test('should enable Validate button after typing content', async ({ page }) => {
    await page.locator('#json-input').fill('{}');
    await expect(page.getByRole('button', { name: /^Validate$/i })).toBeEnabled();
  });

  test('should load sample package.json when Load Sample is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Load Sample/i }).click();
    const textarea = page.locator('#json-input');
    const value = await textarea.inputValue();
    expect(value).toContain('"name"');
    expect(value).toContain('"version"');
  });

  test('should validate valid package.json and show results', async ({ page }) => {
    await page.getByRole('button', { name: /Load Sample/i }).click();
    await page.getByRole('button', { name: /^Validate$/i }).click();
    await expect(page.getByText(/Validation Results/i)).toBeVisible();
  });

  test('should show 0 errors for the sample package.json', async ({ page }) => {
    await page.getByRole('button', { name: /Load Sample/i }).click();
    await page.getByRole('button', { name: /^Validate$/i }).click();
    // Sample is valid — 0 errors expected
    await expect(page.getByText(/0 error\(s\)/i)).toBeVisible();
  });

  test('should report error for invalid JSON input', async ({ page }) => {
    await page.locator('#json-input').fill('{invalid json}');
    await page.getByRole('button', { name: /^Validate$/i }).click();
    await expect(page.getByText(/Validation Results/i)).toBeVisible();
    // Should contain at least one error
    await expect(page.getByText(/error/i).first()).toBeVisible();
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Load Sample/i }).click();
    await page.getByRole('button', { name: /^Clear$/i }).click();
    const textarea = page.locator('#json-input');
    await expect(textarea).toHaveValue('');
  });
});
