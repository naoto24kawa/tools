import { test, expect } from '@playwright/test';

test.describe('Unix Timestamp Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-unix');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Unix Timestamp Converter/i })).toBeVisible();
  });

  test('should display current time on load', async ({ page }) => {
    // The live clock should be showing a numeric timestamp
    const code = page.locator('code').first();
    await expect(code).toBeVisible();
    const text = await code.textContent();
    expect(Number(text)).toBeGreaterThan(0);
  });

  test('should convert unix timestamp 0 to 1970', async ({ page }) => {
    const input = page.locator('#timestamp');
    await input.fill('0');
    // Unix epoch 0 = 1970-01-01; appears in multiple code elements, use first()
    await expect(page.getByText(/1970/).first()).toBeVisible();
  });

  test('should convert unix timestamp 1000000000 and show ISO 8601', async ({ page }) => {
    const input = page.locator('#timestamp');
    await input.fill('1000000000');
    // Should show ISO 8601 label and its value
    await expect(page.getByText('ISO 8601')).toBeVisible();
    // "2001" appears in multiple code elements, use first()
    await expect(page.getByText(/2001/).first()).toBeVisible();
  });

  test('should update timestamp when Now button is clicked', async ({ page }) => {
    const input = page.locator('#timestamp');
    // Set to 0 first
    await input.fill('0');
    await expect(page.getByText(/1970/).first()).toBeVisible();
    // Click Now to restore current timestamp
    await page.getByRole('button', { name: /Now/i }).click();
    // After clicking Now, the dates show current year, not 1970
    const count = await page.getByText(/1970/).count();
    expect(count).toBe(0);
  });

  test('should show formatted date outputs when valid timestamp entered', async ({ page }) => {
    const input = page.locator('#timestamp');
    await input.fill('0');
    await expect(page.getByText('ローカル日時')).toBeVisible();
    await expect(page.getByText('UTC')).toBeVisible();
    await expect(page.getByText('相対時間')).toBeVisible();
  });
});
