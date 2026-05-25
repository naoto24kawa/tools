import { test, expect } from '@playwright/test';

test.describe('RFC 2822 Date Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-rfc2822');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /RFC 2822 Date Converter/i })).toBeVisible();
  });

  test('should show conversion results on load with default RFC 2822 string', async ({ page }) => {
    // Pre-populated with current date in RFC 2822; should show RFC 2822, UTC, ISO 8601 rows
    // These labels appear multiple times in heading/buttons; use first()
    await expect(page.getByText('RFC 2822').first()).toBeVisible();
    await expect(page.getByText('UTC').first()).toBeVisible();
    await expect(page.getByText('ISO 8601').first()).toBeVisible();
  });

  test('should convert a known RFC 2822 date string', async ({ page }) => {
    const input = page.locator('#rfc2822-input');
    // Thu, 01 Jan 1970 00:00:00 +0000
    await input.fill('Thu, 01 Jan 1970 00:00:00 +0000');
    // "1970" appears in multiple code/input elements; use first()
    await expect(page.getByText(/1970/).first()).toBeVisible();
    await expect(page.getByText('ISO 8601').first()).toBeVisible();
  });

  test('should show error for invalid date', async ({ page }) => {
    const input = page.locator('#rfc2822-input');
    await input.fill('not-a-valid-date');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/Invalid date/i)).toBeVisible();
  });

  test('should update to current time when Now button is clicked', async ({ page }) => {
    const currentYear = new Date().getFullYear().toString();
    await page.getByRole('button', { name: /Now/i }).click();
    // currentYear appears in multiple code/input elements; use first()
    await expect(page.getByText(new RegExp(currentYear)).first()).toBeVisible();
  });

  test('should update via date picker', async ({ page }) => {
    const picker = page.locator('#rfc2822-picker');
    await picker.fill('1970-01-01T00:00');
    await expect(page.getByText(/1970/).first()).toBeVisible();
  });
});
