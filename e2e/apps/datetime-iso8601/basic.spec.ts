import { test, expect } from '@playwright/test';

test.describe('ISO 8601 Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-iso8601');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ISO 8601 Converter/i })).toBeVisible();
  });

  test('should display conversion results on load with default ISO string', async ({ page }) => {
    // The input is pre-populated with current ISO string; variants should show
    await expect(page.getByText(/UTC/i)).toBeVisible();
  });

  test('should convert a known ISO 8601 string and show variants', async ({ page }) => {
    const input = page.locator('#iso8601-input');
    await input.fill('1970-01-01T00:00:00.000Z');
    // Should show variant labels
    await expect(page.getByText('UTC')).toBeVisible();
    await expect(page.getByText(/1970/)).toBeVisible();
  });

  test('should show error message for invalid date string', async ({ page }) => {
    const input = page.locator('#iso8601-input');
    await input.fill('not-a-date');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/Invalid date string/i)).toBeVisible();
  });

  test('should update to current time when Now button is clicked', async ({ page }) => {
    const currentYear = new Date().getFullYear().toString();
    await page.getByRole('button', { name: /Now/i }).click();
    await expect(page.getByText(new RegExp(currentYear))).toBeVisible();
  });

  test('should show multiple format variants for a valid date', async ({ page }) => {
    const input = page.locator('#iso8601-input');
    await input.fill('2000-01-01T00:00:00.000Z');
    // Variants section should contain multiple rows
    const codeElements = page.locator('code');
    await expect(codeElements.first()).toBeVisible();
  });
});
