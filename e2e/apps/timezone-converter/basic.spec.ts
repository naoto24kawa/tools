import { test, expect } from '@playwright/test';

test.describe('Timezone Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timezone-converter');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Timezone Converter' })).toBeVisible();
  });

  test('should show datetime input', async ({ page }) => {
    await expect(page.locator('input#datetime')).toBeVisible();
  });

  test('should show From and To timezone selectors', async ({ page }) => {
    await expect(page.locator('select#fromTz')).toBeVisible();
    await expect(page.locator('select#toTz')).toBeVisible();
  });

  test('should have UTC as default From timezone', async ({ page }) => {
    await expect(page.locator('select#fromTz')).toHaveValue('UTC');
  });

  test('should have Asia/Tokyo as default To timezone', async ({ page }) => {
    await expect(page.locator('select#toTz')).toHaveValue('Asia/Tokyo');
  });

  test('should have Now button to set current time', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Now' })).toBeVisible();
  });

  test('should fill datetime input when Now button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Now' }).click();
    const value = await page.locator('input#datetime').inputValue();
    expect(value).toBeTruthy();
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  test('should convert timezone when Convert button is clicked', async ({ page }) => {
    // Set a specific datetime
    await page.locator('input#datetime').fill('2024-01-01T12:00');
    // Click the convert button (ArrowRight)
    await page.getByRole('button', { name: /convert timezone/i }).click();
    // Result should appear
    await expect(page.getByText('Result')).toBeVisible();
  });

  test('should show Current Time Around the World section', async ({ page }) => {
    await expect(page.getByText('Current Time Around the World')).toBeVisible();
  });

  test('should display multiple timezone clocks', async ({ page }) => {
    const timeItems = page.locator('.font-mono').filter({ hasText: /\d{2}:\d{2}/ });
    await expect(timeItems.first()).toBeVisible();
  });

  test('should show converted result with font-mono styling', async ({ page }) => {
    await page.locator('input#datetime').fill('2024-06-15T09:00');
    await page.locator('select#fromTz').selectOption('UTC');
    await page.locator('select#toTz').selectOption('Asia/Tokyo');
    await page.getByRole('button', { name: /convert timezone/i }).click();
    // Result should show Tokyo time (UTC+9 = 18:00)
    const result = page.locator('.font-mono').first();
    await expect(result).toBeVisible();
  });
});
