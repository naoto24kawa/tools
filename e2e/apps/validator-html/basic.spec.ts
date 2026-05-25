import { test, expect } from '@playwright/test';

test.describe('HTML Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/validator-html');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/HTML Validator/i)).toBeVisible();
  });

  test('should show "Valid HTML" for well-formed HTML', async ({ page }) => {
    const textarea = page.locator('textarea#html-input');
    // Include DOCTYPE to avoid "Missing DOCTYPE" warning so "Valid HTML" is shown
    await textarea.fill('<!DOCTYPE html><html><body><p>Hello</p></body></html>');
    await expect(page.getByText(/Valid HTML/i)).toBeVisible();
  });

  test('should report errors for unclosed tags', async ({ page }) => {
    const textarea = page.locator('textarea#html-input');
    await textarea.fill('<div><p>Unclosed div</p>');
    // Errors or warnings should appear
    await expect(page.getByText(/error|warning/i)).toBeVisible();
  });

  test('should show error count for invalid HTML', async ({ page }) => {
    const textarea = page.locator('textarea#html-input');
    await textarea.fill('<div><span>Missing closing tags');
    await expect(page.getByText(/\d+\s*error/i)).toBeVisible();
  });

  test('should validate a minimal valid document', async ({ page }) => {
    const textarea = page.locator('textarea#html-input');
    // Include DOCTYPE to ensure "Valid HTML" shows (without DOCTYPE, shows warning)
    await textarea.fill('<!DOCTYPE html><p>Simple paragraph</p>');
    // No errors = valid
    await expect(page.getByText(/Valid HTML/i)).toBeVisible();
  });

  test('should update validation result in real-time as user types', async ({ page }) => {
    const textarea = page.locator('textarea#html-input');
    await textarea.fill('<div>');
    // First shows errors
    await expect(page.getByText(/error/i)).toBeVisible();
    // Fix it with DOCTYPE to show "Valid HTML"
    await textarea.fill('<!DOCTYPE html><div></div>');
    await expect(page.getByText(/Valid HTML/i)).toBeVisible();
  });

  test('should not show validation status when textarea is empty', async ({ page }) => {
    const textarea = page.locator('textarea#html-input');
    await expect(textarea).toHaveValue('');
    await expect(page.getByText(/Valid HTML/i)).not.toBeVisible();
    await expect(page.getByText(/error/i)).not.toBeVisible();
  });

  test('should show warnings for missing optional but recommended attributes', async ({ page }) => {
    const textarea = page.locator('textarea#html-input');
    // img without alt is a common warning
    await textarea.fill('<img src="test.jpg">');
    // Should show warnings (not necessarily errors)
    await expect(page.getByText(/warning/i)).toBeVisible();
  });
});
