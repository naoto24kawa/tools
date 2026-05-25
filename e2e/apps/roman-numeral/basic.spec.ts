import { test, expect } from '@playwright/test';

test.describe('Roman Numeral Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/roman-numeral');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Roman Numeral Converter' })).toBeVisible();
  });

  test('should convert 42 to XLII', async ({ page }) => {
    await page.locator('input#arabic-input').fill('42');
    await page.getByRole('button', { name: /Convert to Roman/i }).click();
    await expect(page.getByText('XLII')).toBeVisible();
  });

  test('should convert 2024 to MMXXIV', async ({ page }) => {
    await page.locator('input#arabic-input').fill('2024');
    await page.getByRole('button', { name: /Convert to Roman/i }).click();
    await expect(page.getByText('MMXXIV')).toBeVisible();
  });

  test('should convert XIV to 14', async ({ page }) => {
    await page.locator('input#roman-input').fill('XIV');
    await page.getByRole('button', { name: /Convert to Arabic/i }).click();
    await expect(page.getByText('14')).toBeVisible();
  });

  test('should convert XLII to 42', async ({ page }) => {
    await page.locator('input#roman-input').fill('XLII');
    await page.getByRole('button', { name: /Convert to Arabic/i }).click();
    await expect(page.getByText('42')).toBeVisible();
  });

  test('should show error toast for out-of-range arabic number', async ({ page }) => {
    await page.locator('input#arabic-input').fill('4000');
    await page.getByRole('button', { name: /Convert to Roman/i }).click();
    await expect(page.getByText(/Invalid input/i)).toBeVisible();
  });

  test('should show error toast for invalid Roman numeral', async ({ page }) => {
    await page.locator('input#roman-input').fill('IIII');
    await page.getByRole('button', { name: /Convert to Arabic/i }).click();
    await expect(page.getByText(/Invalid input/i)).toBeVisible();
  });

  test('should have Convert to Roman button disabled when arabic input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Convert to Roman/i })).toBeDisabled();
  });

  test('should display reference table with Roman numeral symbols', async ({ page }) => {
    await expect(page.getByText('Reference Table')).toBeVisible();
    await expect(page.getByText('M')).toBeVisible();
    await expect(page.getByText('CM')).toBeVisible();
    await expect(page.getByText('D')).toBeVisible();
  });
});
